from fastapi import HTTPException, status, Response, Depends, APIRouter
from typing import List
from .. import models, schemas, oauth2
from ..database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import oauth2
from .. import database


router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)


# Get all posts
@router.get("/", response_model=List[schemas.PostResponse])
def get_posts(db: Session = Depends(get_db), current_user: dict = Depends(oauth2.get_current_user), search: str = "", skip: int = 1,  limit: int = 5):

    # posts = db.query(models.Post).filter(
    #     models.Post.owner_id == current_user.id).all()  # to get just the logged in user posts
    # posts = db.query(models.Post).order_by(
    #     models.Post.created_at.desc()).filter(models.Post.title.ilike(f"%{search}%")).limit(limit).offset(skip).all()

    posts = db.query(models.Post, func.count(models.Vote.post_id).label("votes")).order_by(models.Post.created_at.desc()).join(
        models.Vote, models.Vote.post_id == models.Post.id, isouter=True).group_by(models.Post.id).filter(models.Post.title.ilike(f"%{search}%")).offset((skip-1)*limit).limit(limit).all()

    return posts

# Get posts count


@router.get("/count")
def get_posts(db: Session = Depends(get_db), current_user: dict = Depends(oauth2.get_current_user)):
    post_count = db.query(func.count(models.Post.id)).scalar()
    return {"post_count": post_count}


# Create new post
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Post)
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db), current_user: dict = Depends(oauth2.get_current_user)):

    new_post = models.Post(owner_id=current_user.id, **post.model_dump())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post


# Get the latest post
@router.get("/latest", response_model=schemas.PostResponse)
def get_post(db: Session = Depends(get_db), current_user: dict = Depends(oauth2.get_current_user)):

    latest_post = db.query(models.Post, func.count(models.Vote.post_id).label("votes")).join(
        models.Vote, models.Vote.post_id == models.Post.id, isouter=True).group_by(models.Post.id).order_by(
        models.Post.created_at.desc()).first()

    if not latest_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    return latest_post


# Get one specific post by id
# id is called a path parameter
@router.get("/{id}", response_model=schemas.PostResponse)
def get_post(id: int, db: Session = Depends(get_db), current_user: dict = Depends(oauth2.get_current_user)):

    post = db.query(models.Post, func.count(models.Vote.post_id).label("votes")).join(
        models.Vote, models.Vote.post_id == models.Post.id, isouter=True).group_by(models.Post.id).filter(models.Post.id == id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Post with id: {id} not found")

    return post


# Delete one specific post by id
# id is called a path parameter
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(id: int, db: Session = Depends(get_db), current_user: dict = Depends(oauth2.get_current_user)):

    post_query = db.query(models.Post).filter(models.Post.id == id)
    post = post_query.first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Post with id: {id} not found")

    if post.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"Not authorized to perform the requested action")

    post_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


# Update one specific post by id
@router.put("/{id}", response_model=schemas.Post)
def update_post(id: int, updated_post: schemas.PostCreate, db: Session = Depends(get_db), current_user: dict = Depends(oauth2.get_current_user)):

    post_query = db.query(models.Post).filter(models.Post.id == id)
    post = post_query.first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Post with id: {id} not found")

    if post.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"Not authorized to perform the requested action")

    post_query.update(updated_post.model_dump(), synchronize_session=False)
    db.commit()

    return post_query.first()


@router.get("/{post_id}/likes", response_model=dict)
def get_post_likes(post_id: int, db: Session = Depends(get_db)):
    try:
        # Assuming you have a Post model with an 'id' column
        post = db.query(models.Post).filter_by(id=post_id).first()

        if post is None:
            raise HTTPException(status_code=404, detail="Post not found")

        # Assuming you have a Vote model with 'user_id' and 'post_id' columns
        likes = db.query(models.Vote).filter_by(post_id=post_id).all()

        # Get user information for each like
        liked_users = []
        for like in likes:
            user = db.query(models.User).filter_by(id=like.user_id).first()
            if user:
                liked_users.append({
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'profile_picture': user.profilePicture
                })

        return {'likes': liked_users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{post_id}/comments", response_model=List[schemas.CommentResponse])
def get_comments_for_post(post_id: int, db: Session = Depends(database.get_db)):

    comments = db.query(models.Comment, func.count(models.CommentVote.comment_id).label('votes')).\
        outerjoin(models.CommentVote, models.CommentVote.comment_id == models.Comment.id).\
        join(models.Post, models.Post.id == models.Comment.post_id).\
        filter(models.Post.id == post_id).\
        group_by(models.Comment.id).all()

    return comments

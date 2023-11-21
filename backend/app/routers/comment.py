from turtle import mode
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, database, models, oauth2

router = APIRouter(
    prefix="/comment",
    tags=['Comment']
)


@router.get("/", status_code=status.HTTP_200_OK)
def get_comments(db: Session = Depends(database.get_db), current_user: dict = Depends(oauth2.get_current_user)):
    comments = db.query(models.Comment).all()
    return comments


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_comment(comment: schemas.CreateComment, db: Session = Depends(database.get_db), current_user: dict = Depends(oauth2.get_current_user)):

    found_post = db.query(models.Post).filter(
        models.Post.id == comment.post_id).first()

    if not found_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Post with id:{comment.post_id} not found")

    new_comment = models.Comment(
        content=comment.content,
        post_id=comment.post_id,
        user_id=current_user.id
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return new_comment


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(comment_id: int, db: Session = Depends(database.get_db), current_user: dict = Depends(oauth2.get_current_user)):
    comment_query = db.query(models.Comment).filter(
        models.Comment.id == comment_id)

    comment = comment_query.first()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")

    if comment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="You don't have permission to delete this comment")

    comment_query.delete(synchronize_session=False)
    db.commit()

    return None


@router.get("/{comment_id}", response_model=schemas.Comment)
def get_comment(comment_id: int, db: Session = Depends(database.get_db), current_user: dict = Depends(oauth2.get_current_user)):
    comment_query = db.query(models.Comment).filter(
        models.Comment.id == comment_id)

    comment = comment_query.first()

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")

    return comment


@router.put("/{comment_id}", response_model=schemas.Comment)
def update_comment(content: schemas.UpdateComment, comment_id: int, db: Session = Depends(database.get_db), current_user: dict = Depends(oauth2.get_current_user)):

    comment = db.query(models.Comment).filter(
        models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")

    if comment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="You don't have permission to update this comment")

    comment.content = content.content

    db.commit()

    return comment


@router.get("/{comment_id}/likes", response_model=dict)
def get_comment_likes(comment_id: int, db: Session = Depends(database.get_db)):
    try:
        # Assuming you have a Comment model with an 'id' column
        comment = db.query(models.Comment).filter_by(id=comment_id).first()

        if comment is None:
            raise HTTPException(status_code=404, detail="Comment not found")

        # Assuming you have a Vote model with 'user_id' and 'post_id' columns
        likes = db.query(models.CommentVote).filter_by(
            comment_id=comment_id).all()

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

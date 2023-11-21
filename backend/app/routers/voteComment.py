from fastapi import APIRouter, Depends, status, HTTPException, Response
from sqlalchemy.orm import Session
from .. import schemas, database, models, oauth2

router = APIRouter(
    prefix="/voteComment",
    tags=['Vote Comment']
)


@router.post("/", status_code=status.HTTP_201_CREATED)
def vote_comment(vote: schemas.VoteComment, db: Session = Depends(database.get_db), current_user: dict = Depends(oauth2.get_current_user)):

    found_comment = db.query(models.Comment).filter(
        models.Comment.id == vote.comment_id).first()

    if not found_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Comment with id:{vote.comment_id} not found")

    vote_query = db.query(models.CommentVote).filter(
        models.CommentVote.comment_id == vote.comment_id, models.CommentVote.user_id == current_user.id)
    found_vote = vote_query.first()

    if vote.dir == 1:
        if found_vote:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                                detail=f"user {current_user.id} has already voted on comment {vote.comment_id}")

        new_vote = models.CommentVote(comment_id=vote.comment_id,
                                      user_id=current_user.id)
        db.add(new_vote)
        db.commit()
        return {"message": "successfully added vote"}

    else:
        if not found_vote:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Vote does not exists")

        vote_query.delete(synchronize_session=False)
        db.commit()

        return {"message", "successfully deleted vote"}

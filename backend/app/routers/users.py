from fastapi import HTTPException, status, Depends, APIRouter
from .. import models, schemas
from ..database import get_db
from sqlalchemy.orm import Session
from ..utils import hash
from ..constants import defaultProfilePicture


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing_email = db.query(models.User).filter(
        models.User.email == user.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"User with this email already exists")

    existing_username = db.query(models.User).filter(
        models.User.username == user.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"User with this username already exists")

    # hash the password - user.password
    hashed_password = hash(user.password)
    user.password = hashed_password
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": f"User {new_user.username} registered successfully", "user": {

            "id": new_user.id,
            "email": new_user.email,
            "username": new_user.username,
            "created_at": new_user.created_at
            }}


# get user by username
@router.get("/getUserByUsername/{username}", response_model=schemas.GetUserResponse)
def get_user(username: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.username == username).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with username: {username} does not exists")

    return user


# get user by id
@router.get("/getUserById/{id}", response_model=schemas.GetUserResponse)
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with id: {id} does not exists")

    return user


# update user
@router.put("/{id}")
def get_user(id: int, updatedUser: dict, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {id} not found",
        )

    for field, value in updatedUser.items():
        if field == "password" and not value:
            continue

        if field == "password":
            value = hash(value)
            setattr(user, field, value)

        if field == "profilePicture" and not value:
            value = defaultProfilePicture
            setattr(user, field, value)

        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    user_dict = user.__dict__
    user_dict.pop("password", None)

    return {"message": "User updated successfully", "user": user_dict}

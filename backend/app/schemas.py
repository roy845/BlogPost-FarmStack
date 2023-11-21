from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class PostBase(BaseModel):
    title: str
    content: str
    image: str = ""
    published: bool = True


class PostCreate(PostBase):
    pass


class UserResponse(BaseModel):
    message: str
    user: dict

    class Config:
        form_attributes = True


class GetUserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    profilePicture: str
    created_at: datetime

    class Config:
        form_attributes = True


class Comment(BaseModel):
    content: str
    user_id: int
    user: GetUserResponse
    post_id: int
    created_at: datetime
    id: int

    class Config:
        form_attributes = True


class CommentResponse(BaseModel):
    Comment: Comment
    votes: int

    class Config:
        form_attributes = True


class Post(PostBase):
    id: int
    title: str
    content: str
    published: bool
    created_at: datetime
    owner_id: int
    owner: GetUserResponse

    class Config:
        form_attributes = True


class PostResponse(BaseModel):
    Post: Post
    votes: int

    class Config:
        form_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponseLogin(BaseModel):
    access_token: str
    token_type: str
    user: dict
    message: str


class TokenData(BaseModel):
    id: Optional[str] = None


class Vote(BaseModel):
    post_id: int
    # constraint int that means dir can be less than or equal to 1 (0 or 1)
    dir: int


class VoteComment(BaseModel):
    comment_id: int
    # constraint int that means dir can be less than or equal to 1 (0 or 1)
    dir: int


class CreateComment(BaseModel):
    post_id: int
    content: str


class UpdateComment(BaseModel):
    content: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordReset(BaseModel):
    newPassword: str
    token: str

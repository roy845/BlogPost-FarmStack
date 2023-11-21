from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..database import get_db
from .. import schemas, models
import secrets
from jose import JWTError, jwt
from ..utils import verify
from ..oauth2 import create_access_token
from datetime import datetime, timedelta, timezone
from ..utils import send_reset_email, hash
from fastapi.security import OAuth2PasswordBearer
from ..config import settings

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm

router = APIRouter(
    prefix="/auth",
    tags=['Authentication']
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="")


@router.post('/login', response_model=schemas.UserResponseLogin)
# credentials are send via form data and not body!!!
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user = db.query(models.User).filter(
        models.User.email == user_credentials.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    if not verify(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    # create token
    access_token = create_access_token(data={"user_id": user.id})

    # return token
    return {"access_token": access_token, "token_type": "bearer", "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "isAdmin": user.isAdmin,
            "profilePicture": user.profilePicture,
            "created_at": user.created_at
            },
            "message": f"User {user.username} logged in successfully"
            }


@router.get('/checktokenexpiration')
def check_token_expiration(token: str = Depends(oauth2_scheme)):
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"message": "Token is still valid"}

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")


@router.post("/forgotpassword")
def forgot_password(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(
        models.User.email == request.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials")

    # Generate a random token
    token = secrets.token_urlsafe(32)
    expiration_time = datetime.utcnow() + timedelta(minutes=15)

    # Store the token in the database
    password_reset_token = models.PasswordResetToken(
        user_id=user.id, token=token, expiration_time=expiration_time)
    db.add(password_reset_token)
    db.commit()
    db.close()

    # Send the reset email
    send_reset_email(request.email, token)
    return {"message": "Reset email sent"}


@router.post("/resetpassword")
def reset_password(request: schemas.PasswordReset, db: Session = Depends(get_db)):

    token_data_query = db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.token == request.token)
    token_data = db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.token == request.token).first()

    if not token_data:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    # Check if the token is still valid
    if token_data.expiration_time < datetime.now(timezone.utc):
        token_data_query.delete(synchronize_session=False)
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    # Find the user in the database
    user = db.query(models.User).filter(
        models.User.id == token_data.user_id).first()

    # Update the user's password (replace this with your actual password hashing logic)
    user.password = hash(request.newPassword)

    # Remove the used token
    token_data_query.delete(synchronize_session=False)
    db.commit()

    return {"message": "Password reset successfully"}

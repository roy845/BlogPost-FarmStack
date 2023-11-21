from datetime import datetime, timedelta
import secrets
from backend.app import models, schemas
from fastapi import status
from jose import jwt
from backend.app.config import settings
import pytest


@pytest.fixture
def reset_password_token(test_user, session):
    token = secrets.token_urlsafe(32)
    expiration_time = datetime.utcnow() + timedelta(minutes=15)

    password_reset_token = models.PasswordResetToken(
        user_id=test_user["id"], token=token, expiration_time=expiration_time)

    session.add(password_reset_token)
    session.commit()

    return password_reset_token


@pytest.fixture
def expired_reset_password_token(test_user, session):
    token = secrets.token_urlsafe(32)

    expiration_time = datetime.utcnow() - timedelta(minutes=15)

    password_reset_token = models.PasswordResetToken(
        user_id=test_user["id"], token=token, expiration_time=expiration_time)

    session.add(password_reset_token)
    session.commit()

    return password_reset_token


def test_login_user(client, test_user):
    res = client.post(
        '/auth/login', data={"username": test_user["email"], "password": test_user["password"]})
    login_res = schemas.UserResponseLogin(**res.json())
    payload = jwt.decode(
        login_res.access_token, settings.secret_key, algorithms=[settings.algorithm])
    id = payload.get('user_id')
    assert id == test_user["id"]
    assert login_res.token_type == "bearer"
    assert res.status_code == status.HTTP_200_OK
    assert res.json()["user"]["email"] == test_user["email"]
    assert res.json()["user"]["username"] == test_user["username"]


@pytest.mark.parametrize("email, password, status_code", [('wrongemail@gmail.com', 'password123', status.HTTP_403_FORBIDDEN),
                                                          ('sanjeev@gmail.com',
                                                           'wrongpassword', status.HTTP_403_FORBIDDEN),
                                                          ('wrongemail@gmail.com',
                                                           'wrongpassword', status.HTTP_403_FORBIDDEN),
                                                          (None, 'password123',
                                                           status.HTTP_422_UNPROCESSABLE_ENTITY),
                                                          ('sanjeev@gmail.com', None, status.HTTP_422_UNPROCESSABLE_ENTITY)])
def test_incorrect_login(client, email, password, status_code):
    res = client.post(
        "/auth/login", data={"username": email, "password": password})

    assert res.status_code == status_code
    if res.status_code == status.HTTP_403_FORBIDDEN:
        assert res.json().get("detail") == "Invalid Credentials"


def test_forgot_password(client, test_user):
    res = client.post("/auth/forgotpassword",
                      json={"email": test_user["email"]})
    assert res.status_code == status.HTTP_200_OK
    assert res.json().get('message') == "Reset email sent"


@pytest.mark.parametrize("email", [('wrongemail@gmail.com'), ('sanjeev@gmail.com'), ('wrongemail@gmail.com'), ('sanjeev@gmail.com')])
def test_incorrect_email_forgot_password(email, client):
    res = client.post("/auth/forgotpassword",
                      json={"email": email})
    assert res.status_code == status.HTTP_404_NOT_FOUND
    assert res.json().get('detail') == "Invalid Credentials"


def test_reset_password(reset_password_token, client, test_user):

    res = client.post("/auth/resetpassword",
                      json={"token": reset_password_token.token, "newPassword": "1234"})

    assert res.status_code == status.HTTP_200_OK
    assert res.json().get('message') == "Password reset successfully"

    login_res = client.post(
        '/auth/login', data={"username": test_user["email"], "password": "1234"})

    assert login_res.status_code == status.HTTP_200_OK
    assert login_res.json()["token_type"] == "bearer"
    assert login_res.json()["user"]["email"] == test_user["email"]
    assert login_res.json()["user"]["username"] == test_user["username"]


@pytest.mark.parametrize("email, password, status_code", [('wrongemail@gmail.com', 'password123', status.HTTP_403_FORBIDDEN),
                                                          ('sanjeev@gmail.com',
                                                           'wrongpassword', status.HTTP_403_FORBIDDEN),
                                                          ('wrongemail@gmail.com',
                                                           'wrongpassword', status.HTTP_403_FORBIDDEN),
                                                          (None, 'password123',
                                                           status.HTTP_422_UNPROCESSABLE_ENTITY),
                                                          ('sanjeev@gmail.com', None, status.HTTP_422_UNPROCESSABLE_ENTITY)])
def test_reset_password_wrong_credentials(reset_password_token, email, password, status_code, client):

    res = client.post("/auth/resetpassword",
                      json={"token": reset_password_token.token, "newPassword": "1234"})

    assert res.status_code == status.HTTP_200_OK
    assert res.json().get('message') == "Password reset successfully"

    login_res = client.post(
        '/auth/login', data={"username": email, "password": password})

    assert login_res.status_code == status_code
    if status_code == status.HTTP_403_FORBIDDEN:
        assert login_res.json()["detail"] == "Invalid Credentials"


def test_reset_password_with_expired_token(expired_reset_password_token, client):
    res = client.post("/auth/resetpassword",
                      json={"token": expired_reset_password_token.token, "newPassword": "1234"})

    assert res.status_code == status.HTTP_400_BAD_REQUEST
    assert res.json().get('detail') == "Invalid or expired token"

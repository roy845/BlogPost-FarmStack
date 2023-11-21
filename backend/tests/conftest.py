from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.database import get_db
from ..app.main import app
from ..app.config import settings
from ..app.database import Base
from fastapi import status
from ..app.oauth2 import create_access_token
from ..app import models
from datetime import datetime, timedelta
import pytest


SQLALCHEMY_DATABASE_URL = f'postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}_test'

engine = create_engine(SQLALCHEMY_DATABASE_URL)

TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def client(session):
    # run our code before we run our test
    def override_get_db():
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)


@pytest.fixture
def test_user(client):
    user_data = {"email": "royatali@gmail.com",
                 "password": '123', "username": "royatali"}

    res = client.post("/users/", json=user_data)

    assert res.status_code == status.HTTP_201_CREATED

    new_user = res.json()["user"]
    new_user["password"] = user_data["password"]

    return new_user


@pytest.fixture
def test_user2(client):
    user_data = {"email": "royatali4@gmail.com",
                 "password": '123', "username": "royatali4"}

    res = client.post("/users/", json=user_data)

    assert res.status_code == status.HTTP_201_CREATED

    new_user = res.json()["user"]
    new_user["password"] = user_data["password"]

    return new_user


@pytest.fixture
def token(test_user):
    return create_access_token({"user_id": test_user["id"]})


@pytest.fixture
def authorized_client(client, token):
    client.headers = {**client.headers, "Authorization": f"Bearer {token}"}

    return client


@pytest.fixture
def test_posts(test_user, session, test_user2):
    posts_data = [{

        "title": "first title",
        "content": "first content",
        "image": "",
        "owner_id": test_user['id']
    }, {

        "title": "2nd title",
        "content": "2nd content",
        "image": "",
        "owner_id": test_user['id']
    },
        {

        "title": "3rd title",
        "content": "3rd content",
        "image": "",
        "owner_id": test_user['id']
    }, {

        "title": "3rd title",
        "content": "3rd content",
        "image": "",
        "owner_id": test_user['id']
    }, {
        "title": "4rd title",
        "content": "4rd content",
        "image": "",
        "owner_id": test_user2['id']
    }]

    # session.add_all([models.Post(**post) for post in posts_data])
    # session.commit()

    # return posts_data

    def create_post_model(post):
        return models.Post(**post)

    post_map = map(create_post_model, posts_data)
    posts = list(post_map)

    session.add_all(posts)

    session.commit()

    posts = session.query(models.Post).all()
    return posts


@pytest.fixture
def test_comments(test_user, test_user2, test_posts, session):
    comments_data = [
        {
            "content": "First comment",
            "post_id": test_posts[0].id,
            "user_id": test_user['id']
        },
        {
            "content": "Second comment",
            "post_id": test_posts[1].id,
            "user_id": test_user['id']
        },
        {
            "content": "Third comment",
            "post_id": test_posts[2].id,
            "user_id": test_user['id']
        },
        {
            "content": "Fourth comment",
            "post_id": test_posts[3].id,
            "user_id": test_user['id']
        },
        {
            "content": "Fourth comment",
            "post_id": test_posts[4].id,
            "user_id": test_user2['id']
        }
    ]

    def create_comment_model(comment):
        return models.Comment(**comment)

    comment_objects = map(create_comment_model, comments_data)
    comments = list(comment_objects)
    session.add_all(comments)
    session.commit()

    comments = session.query(models.Comment).all()
    return comments

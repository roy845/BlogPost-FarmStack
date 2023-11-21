
from fastapi import status
from ..app import schemas
import pytest


def test_get_all_comments(authorized_client, test_comments):
    res = authorized_client.get("/comment/")

    assert len(res.json()) == len(test_comments)
    assert res.status_code == status.HTTP_200_OK


def test_unauthorized_user_get_all_comments(client, test_comments):
    res = client.get("/comment/")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED


def test_unauthorized_user_get_one_comment(client, test_comments):
    res = client.get(f"/comment/{test_comments[0].id}")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_one_comment_not_exists(authorized_client, test_comments):
    res = authorized_client.get(f"/comment/888888")
    assert res.status_code == status.HTTP_404_NOT_FOUND


def test_get_one_comment(authorized_client, test_comments):
    res = authorized_client.get(f"/comment/{test_comments[0].id}")

    comment = schemas.Comment(**res.json())
    assert comment.id == test_comments[0].id
    assert comment.content == test_comments[0].content
    assert comment.post_id == test_comments[0].post_id
    assert comment.user_id == test_comments[0].user_id


def test_create_comment(authorized_client, test_user, test_posts):
    res = authorized_client.post(
        '/comment/', json={"content": "bla bla", "post_id": test_posts[0].id, "user_id": test_user["id"]})

    assert res.status_code == status.HTTP_201_CREATED
    assert res.json()["post_id"] == 1
    assert res.json()["content"] == "bla bla"
    assert res.json()["user_id"] == 1


def test_create_comment_on_non_exists_post(authorized_client, test_user, test_posts):
    res = authorized_client.post(
        '/comment/', json={"content": "bla bla", "post_id": 80000, "user_id": test_user["id"]})

    assert res.status_code == status.HTTP_404_NOT_FOUND
    assert res.json()["detail"] == "Post with id:80000 not found"


def test_unauthorized_user_create_comment(client, test_comments, test_user):
    res = client.post(
        '/comment/', json={"content": "bla bla", "post_id": test_comments[0].id, "user_id": test_user["id"]})
    assert res.status_code == status.HTTP_401_UNAUTHORIZED


def test_unauthorized_user_delete_comment(client, test_user, test_comments):
    res = client.delete(
        f"/comment/{test_comments[0].id}")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED


def test_delete_comment_success(authorized_client, test_user, test_comments):
    res = authorized_client.delete(
        f"/comment/{test_comments[0].id}")
    assert res.status_code == status.HTTP_204_NO_CONTENT


def test_delete_comment_non_exists(authorized_client, test_user, test_comments):
    res = authorized_client.delete(f"/comment/8000000")
    assert res.status_code == status.HTTP_404_NOT_FOUND


def test_delete_other_user_comment(authorized_client, test_user, test_comments):
    res = authorized_client.delete(
        f"/comment/{test_comments[4].id}")

    assert res.status_code == status.HTTP_403_FORBIDDEN


def test_update_comment(authorized_client, test_user, test_comments):
    data = {
        "content": "updated content",
    }

    res = authorized_client.put(f"/comment/{test_comments[0].id}", json=data)

    assert res.status_code == status.HTTP_200_OK
    assert res.json()["content"] == data["content"]


def test_update_other_user_comment(authorized_client, test_user, test_user2, test_comments):
    data = {
        "content": "updated content",
    }

    res = authorized_client.put(f"/comment/{test_comments[4].id}", json=data)

    assert res.status_code == status.HTTP_403_FORBIDDEN


def test_unauthorized_user_update_comment(client, test_user, test_user2, test_comments):
    data = {
        "content": "updated content",
    }

    res = client.put(f"/comment/{test_comments[0].id}", json=data)

    assert res.status_code == status.HTTP_401_UNAUTHORIZED


def test_update_comment_non_exists(authorized_client, test_user, test_comments):
    data = {
        "content": "updated content",
    }

    res = authorized_client.put(f"/comment/8000000", json=data)
    assert res.status_code == status.HTTP_404_NOT_FOUND

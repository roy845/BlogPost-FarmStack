from fastapi import status
from backend.tests.conftest import session
from ..app import models
import pytest


@pytest.fixture()
def test_comment_vote(test_comments, session, test_user):
    new_comment_vote = models.CommentVote(
        user_id=test_user['id'], comment_id=test_comments[0].id)
    session.add(new_comment_vote)
    session.commit()


def test_vote_on_comment(authorized_client, test_comments):

    res = authorized_client.post(
        "/voteComment/", json={"comment_id": test_comments[0].id, "dir": 1})
    assert res.status_code == status.HTTP_201_CREATED


def test_vote_twice_comment(authorized_client, test_comments, test_comment_vote):
    res = authorized_client.post(
        "/voteComment/", json={"comment_id": test_comments[0].id, "dir": 1})
    assert res.status_code == status.HTTP_409_CONFLICT


def test_delete_comment_vote(authorized_client, test_comments, test_comment_vote):
    res = authorized_client.post(
        "/voteComment/", json={"comment_id": test_comments[0].id, "dir": 0})
    assert res.status_code == status.HTTP_201_CREATED


def test_delete_comment_vote_non_exists(authorized_client, test_comments):
    res = authorized_client.post(
        "/voteComment/", json={"comment_id": test_comments[0].id, "dir": 0})
    assert res.status_code == status.HTTP_404_NOT_FOUND


def test_vote_non_exists_comment(authorized_client):
    res = authorized_client.post(
        "/voteComment/", json={"comment_id": 80000, "dir": 1})
    assert res.status_code == status.HTTP_404_NOT_FOUND


def test_vote_unauthorized_user_comment(client, test_comments):
    res = client.post(
        "/voteComment/", json={"comment_id": test_comments[0].id, "dir": 1})
    assert res.status_code == status.HTTP_401_UNAUTHORIZED

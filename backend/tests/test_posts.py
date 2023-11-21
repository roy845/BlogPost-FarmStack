
from fastapi import status
from ..app import schemas
import pytest


def test_get_all_posts(authorized_client, test_posts):
    res = authorized_client.get("/posts/")

    assert len(res.json()) == len(test_posts)
    assert res.status_code == 200


def test_unauthorized_user_get_all_posts(client, test_posts):
    res = client.get("/posts/")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED


def test_unauthorized_user_get_one_post(client, test_posts):
    res = client.get(f"/posts/{test_posts[0].id}")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_one_post_not_exists(authorized_client, test_posts):
    res = authorized_client.get(f"/posts/888888")
    assert res.status_code == status.HTTP_404_NOT_FOUND


def test_get_one_post(authorized_client, test_posts):
    res = authorized_client.get(f"/posts/{test_posts[0].id}")

    post = schemas.PostResponse(**res.json())
    assert post.Post.id == test_posts[0].id
    assert post.Post.content == test_posts[0].content
    assert post.Post.title == test_posts[0].title
    assert post.Post.image == test_posts[0].image


@pytest.mark.parametrize("title, content, published, image", [("awesome new title", "awesome new content", True, ""), ("favorite pizza", "i love pepperoni", False, ""), ("tallest skyscrapers", "wahoo", False, "")])
def test_create_post(authorized_client, test_user, test_posts, title, content, published, image):
    res = authorized_client.post(
        '/posts/', json={"title": title, "content": content, "published": published, "image": image})

    created_post = schemas.Post(**res.json())

    assert res.status_code == status.HTTP_201_CREATED
    assert created_post.title == title
    assert created_post.content == content
    assert created_post.published == published
    assert created_post.image == image
    assert created_post.owner_id == test_user["id"]


def test_create_post_default_published_true(authorized_client, test_user, test_posts):
    res = authorized_client.post(
        '/posts/', json={"title": "arbitrary title", "content": "sdkfsdhfksd", })

    created_post = schemas.Post(**res.json())

    assert res.status_code == status.HTTP_201_CREATED
    assert created_post.title == "arbitrary title"
    assert created_post.content == "sdkfsdhfksd"
    assert created_post.published == True
    assert created_post.owner_id == test_user["id"]


def test_unauthorized_user_create_post(client, test_posts):
    res = client.post(
        '/posts/', json={"title": "arbitrary title", "content": "sdkfsdhfksd", })
    assert res.status_code == status.HTTP_401_UNAUTHORIZED


def test_unauthorized_user_delete_post(client, test_user, test_posts):
    res = client.delete(
        f"/posts/{test_posts[0].id}")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED


def test_delete_post_success(authorized_client, test_user, test_posts):
    res = authorized_client.delete(
        f"/posts/{test_posts[0].id}")
    assert res.status_code == status.HTTP_204_NO_CONTENT


def test_delete_post_non_exists(authorized_client, test_user, test_posts):
    res = authorized_client.delete(f"/posts/8000000")
    assert res.status_code == status.HTTP_404_NOT_FOUND


def test_delete_other_user_post(authorized_client, test_user, test_posts):
    res = authorized_client.delete(
        f"/posts/{test_posts[4].id}")
    assert res.status_code == status.HTTP_403_FORBIDDEN


def test_update_post(authorized_client, test_user, test_posts):
    data = {
        "title": "updated title",
        "content": "updated content",
        "id": test_posts[0].id
    }

    res = authorized_client.put(f"/posts/{test_posts[0].id}", json=data)
    updated_post = schemas.Post(**res.json())

    assert res.status_code == status.HTTP_200_OK
    assert updated_post.title == data["title"]
    assert updated_post.content == data["content"]


def test_update_other_user_post(authorized_client, test_user, test_user2, test_posts):
    data = {
        "title": "updated title",
        "content": "updated content",
        "id": test_posts[4].id
    }

    res = authorized_client.put(f"/posts/{test_posts[4].id}", json=data)

    assert res.status_code == status.HTTP_403_FORBIDDEN


def test_unauthorized_user_update_post(client, test_user, test_user2, test_posts):
    data = {
        "title": "updated title",
        "content": "updated content",
        "id": test_posts[0].id
    }

    res = client.put(f"/posts/{test_posts[0].id}", json=data)

    assert res.status_code == status.HTTP_401_UNAUTHORIZED


def test_update_post_non_exists(authorized_client, test_user, test_posts):
    data = {
        "title": "updated title",
        "content": "updated content",
        "id": test_posts[3].id
    }

    res = authorized_client.put(f"/posts/8000000", json=data)
    assert res.status_code == status.HTTP_404_NOT_FOUND

import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Avatar, CardMedia, Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { limitChars } from "../../utils/utils";
import { format } from "timeago.js";
import { HEART_IMAGE, LIKE_IMAGE } from "../../constants/constants";
import toast from "react-hot-toast";
import "./post.css";
import { getAllPostlikes, likePost } from "../../Api/ServerAPI";
import { useAuth } from "../../context/auth";
import BasicModal from "../Modal";
import CommentsModal from "../CommentsModal";
import NoLikes from "../NoLikes";

const Post = ({ post }) => {
  const { id, title, content, image, owner, created_at } = post.Post;
  const [like, setLike] = useState(post?.votes);
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [openCommentsPost, setOpenCommentsPostModal] = useState(false);

  const { auth } = useAuth();

  const limitedContent = limitChars(content, 30);

  const navigate = useNavigate();

  const navigateToPostPage = (postId) => {
    navigate(`/post/${postId}`);
  };

  const likeHandler = async () => {
    try {
      isLiked
        ? await likePost(post?.Post?.id, 0)
        : await likePost(post?.Post?.id, 1);
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const fetchAllPostLikes = async () => {
      try {
        const { data } = await getAllPostlikes(post?.Post?.id);
        setLikes(data.likes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPostLikes();
  }, [auth?.user?.id, likes.length, isLiked]);

  useEffect(() => {
    setIsLiked(likes.some((like) => like.id === auth?.user?.id));
  }, [auth?.user?.id, likes.length]);

  const timeAgo = format(created_at);

  const handleLikesModal = () => {
    setOpenLikesModal(true);
  };

  const handleCommentsPostModal = () => {
    setOpenCommentsPostModal(true);
  };

  let contentLikesModal = (
    <>
      {likes.length === 0 && <NoLikes post />}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {likes?.map((like, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Link to={`/profile/${like.username}`}>
              <Tooltip title={like.username}>
                <Avatar src={like?.profile_picture} />
              </Tooltip>
            </Link>
            <span>{like?.username}</span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <Card sx={{ marginLeft: "30px", cursor: "pointer" }}>
      {image && (
        <CardMedia
          component="img"
          alt="Post Image"
          height="140"
          onClick={() => navigateToPostPage(id)}
          image={image}
        />
      )}
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {limitedContent}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          By {owner.username} • {timeAgo}
        </Typography>
        <div className="postBottomLeft">
          <img
            className="likeIcon"
            src={LIKE_IMAGE}
            onClick={likeHandler}
            alt=""
          />
          <img
            className="likeIcon"
            src={HEART_IMAGE}
            onClick={likeHandler}
            alt=""
          />
          <span
            className="postLikeCounter"
            style={{ cursor: "pointer" }}
            onClick={handleLikesModal}
          >
            {like} people like it
          </span>
          <span
            className="postCommentText"
            style={{
              cursor: "pointer",
              display: "flex",
              margin: "auto",
            }}
            onClick={handleCommentsPostModal}
          >
            comments
          </span>
        </div>
      </CardContent>
      {openLikesModal && (
        <BasicModal
          open={openLikesModal}
          setOpen={setOpenLikesModal}
          title="Likes"
          content={contentLikesModal}
        />
      )}

      {openCommentsPost && (
        <CommentsModal
          open={openCommentsPost}
          setOpen={setOpenCommentsPostModal}
          title="Comments"
          postId={id}
        />
      )}
    </Card>
  );
};

export default Post;

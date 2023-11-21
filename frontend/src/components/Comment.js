import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { format } from "timeago.js";
import { HEART_IMAGE, LIKE_IMAGE } from "../constants/constants";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteComment,
  getAllCommentlikes,
  likeComment,
} from "../Api/ServerAPI";
import AlertDialog from "./AletDialog";
import EditCommentModal from "./EditCommentModal";
import { useAuth } from "../context/auth";
import BasicModal from "./Modal";
import NoLikes from "./NoLikes";

const Comment = ({ comment, fetchAgain, setFetchAgain }) => {
  const [like, setLike] = useState(comment?.votes);
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState(false);
  const [openEditCommentDialog, setOpenEditCommentDialog] = useState(false);
  const { auth } = useAuth();

  const handleLikesModal = () => {
    setOpenLikesModal(true);
  };

  const deleteCommentFromPost = async () => {
    try {
      await deleteComment(comment?.Comment?.id);
      setFetchAgain(!fetchAgain);
      setOpenDeleteCommentDialog(false);
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const likeHandler = async () => {
    try {
      isLiked
        ? await likeComment(comment?.Comment?.id, 0)
        : await likeComment(comment?.Comment?.id, 1);
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleEditComment = () => {
    setOpenEditCommentDialog(true);
  };

  const handleDeleteComment = () => {
    setOpenDeleteCommentDialog(true);
  };

  useEffect(() => {
    const fetchAllCommentLikes = async () => {
      try {
        const { data } = await getAllCommentlikes(comment?.Comment?.id);
        setLikes(data.likes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllCommentLikes();
  }, [auth?.user?.id, likes.length, isLiked]);

  useEffect(() => {
    setIsLiked(likes.some((like) => like.id === auth?.user?.id));
  }, [auth?.user?.id, likes.length]);

  let contentLikesModal = (
    <>
      {likes.length === 0 && <NoLikes />}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {likes.map((like, index) => (
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
    <Paper
      elevation={3}
      key={comment?.Comment?.id}
      style={{
        padding: "16px",
        marginBottom: "15px",
      }}
    >
      <Grid
        container
        spacing={2}
        key={comment?.Comment?.id}
        style={{
          padding: "10px",
        }}
      >
        <Grid item>
          <Link
            style={{ textDecoration: "none", cursor: "pointer" }}
            to={`/profile/${comment?.Comment?.user?.username}`}
          >
            <Avatar
              alt={comment?.Comment?.user?.username}
              src={comment?.Comment?.user?.profilePicture}
            />
          </Link>
        </Grid>

        <Grid item xs>
          <Typography variant="subtitle1" component="div">
            <strong>{comment?.Comment?.user?.username}</strong>
          </Typography>

          <Typography variant="h5">{comment?.Comment?.content}</Typography>
          <Typography variant="body2" color="textSecondary">
            {format(comment?.Comment?.created_at)}
          </Typography>

          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={LIKE_IMAGE}
              alt=""
              onClick={likeHandler}
            />
            <img
              className="likeIcon"
              src={HEART_IMAGE}
              alt=""
              onClick={likeHandler}
            />
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ marginLeft: "4px", cursor: "pointer" }}
              onClick={handleLikesModal}
            >
              {like} people like it
            </Typography>
          </div>

          <Box display="flex" alignItems="center" justifyContent="flex-end">
            {auth?.user?.id === comment?.Comment?.user?.id ||
            auth?.user?.Comment?.isAdmin ? (
              <IconButton
                color="primary"
                onClick={() => handleEditComment(comment)}
              >
                <EditIcon />
              </IconButton>
            ) : null}
            {auth?.user?.id === comment?.Comment?.user?.id ||
            auth?.user?.isAdmin ? (
              <IconButton
                color="error"
                onClick={() => handleDeleteComment(comment)}
              >
                <DeleteIcon />
              </IconButton>
            ) : null}
          </Box>
        </Grid>
      </Grid>
      {openDeleteCommentDialog && (
        <AlertDialog
          open={openDeleteCommentDialog}
          setOpen={setOpenDeleteCommentDialog}
          title="Delete comment"
          content="Are you sure do you want to delete this comment ?"
          handleFunction={deleteCommentFromPost}
        />
      )}
      {openEditCommentDialog && (
        <EditCommentModal
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          open={openEditCommentDialog}
          setOpen={setOpenEditCommentDialog}
          comment={comment}
        />
      )}
      <BasicModal
        open={openLikesModal}
        setOpen={setOpenLikesModal}
        title="Likes"
        content={contentLikesModal}
      />
    </Paper>
  );
};

export default Comment;

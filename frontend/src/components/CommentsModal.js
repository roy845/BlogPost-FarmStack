import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Paper, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { addCommentToPost, getAllPostComments } from "../Api/ServerAPI";
import { useAuth } from "../context/auth";
import AlertDialog from "./AletDialog";
import EditCommentModal from "./EditCommentModal";
import NoComments from "./NoComments";
import Comment from "./Comment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxHeight: "80vh", // Set maximum height for the modal
  overflowY: "auto", // Enable vertical scrolling
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const inputContainerStyle = {
  position: "sticky",
  zIndex: 1,
  bottom: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px",
};

export default function CommentsModal({ open, setOpen, title, postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [fetchAgain, setFetchAgain] = useState(false);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchAllPostComments = async () => {
      try {
        const { data } = await getAllPostComments(postId);

        setComments(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPostComments();
  }, [postId, fetchAgain]);

  const handleSubmitComment = async () => {
    try {
      await addCommentToPost(postId, content);

      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error);
    }

    setContent("");
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center" }}
          >
            {title}
          </Typography>
          {comments?.length === 0 ? (
            <NoComments />
          ) : (
            comments?.map((comment, index) => (
              <Comment
                key={index}
                comment={comment}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            ))
          )}

          <Paper style={inputContainerStyle}>
            <TextField
              label="Add a Comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{ width: "400px" }}
            />
            <Button
              disabled={!content}
              variant="contained"
              color="primary"
              onClick={handleSubmitComment}
              style={{ marginLeft: "8px" }}
            >
              <SendIcon />
            </Button>
          </Paper>
        </Box>
      </Modal>
    </div>
  );
}

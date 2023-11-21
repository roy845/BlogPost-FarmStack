import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { getComment, updateComment } from "../Api/ServerAPI";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EditCommentModal({
  open,
  setOpen,
  comment,
  fetchAgain,
  setFetchAgain,
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const { data } = await getComment(comment?.Comment?.id);
        setContent(data.content);
      } catch (error) {
        console.log(error);
      }
    };

    fetchComment();
  }, [comment?.Comment?.id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateComment(comment?.Comment?.id, content);

      setLoading(false);
      toast.success("Comment updated successfully");

      setOpen(false);

      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit comment
          </Typography>
          <TextField
            label="content"
            value={content}
            onChange={(e) => {
              const newValue = e.target.value;
              setContent(newValue);
            }}
            sx={{ width: "100%", mt: "10px" }}
          />

          <Box
            display="flex"
            sx={{ marginTop: "20px" }}
            justifyContent="space-between"
            gap="200px"
          >
            <Button
              disabled={loading}
              variant="contained"
              style={{ backgroundColor: "red" }}
              onClick={() => {
                setOpen(false);
              }}
            >
              Discard
            </Button>
            <Button
              disabled={loading || !content}
              onClick={handleSave}
              variant="contained"
            >
              SAVE
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

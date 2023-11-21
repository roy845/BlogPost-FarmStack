import {
  Paper,
  TextField,
  InputAdornment,
  TextareaAutosize,
  Typography,
  Button,
} from "@mui/material";
import TitleIcon from "@mui/icons-material/Title";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MAX_CONTENT_CHARACTERS,
  MAX_TITLE_CHARACTERS,
} from "../constants/constants";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { updatePost, getPost } from "../Api/ServerAPI";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import { isValidImageExtension } from "../utils/utils";

const EditPost = () => {
  const [post, setPost] = useState({
    title: "",
    content: "",
    image: "",
    published: false,
  });
  const [isImageValid, setIsImageValid] = useState(true);

  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { postId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await getPost(postId);
        setPost(data.Post);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleUpdatePost = async () => {
    try {
      await updatePost(postId, post);
      toast.success("Post updated successfully");
      navigate("/");
    } catch (error) {
      setAuth(null);
      localStorage.removeItem("auth");
      navigate("/");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title" && value.length <= MAX_TITLE_CHARACTERS) {
      setPost({ ...post, [name]: value });
    } else if (name === "content" && value.length <= MAX_CONTENT_CHARACTERS) {
      setPost({ ...post, [name]: value });
    } else if (name === "image") {
      setPost({ ...post, [name]: value });
      setIsImageValid(true);
      if (value && !isValidImageExtension(value)) {
        setIsImageValid(false);
      }
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  const handleImageError = () => {
    setIsImageValid(false);
  };

  const titleCharacterCount = post?.title?.length;
  const contentCharacterCount = post?.content?.length;

  const isTitleOverLimit = titleCharacterCount > MAX_TITLE_CHARACTERS;
  const isContentOverLimit = contentCharacterCount > MAX_CONTENT_CHARACTERS;

  return (
    <Layout title="New post">
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: 20,
            width: "50em",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <h1>Update post</h1>
          <TextField
            type="text"
            margin="normal"
            label="Title"
            variant="outlined"
            name="title"
            fullWidth
            value={post?.title}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="caption"
            sx={{ justifyContent: "flex-end" }}
            color={isTitleOverLimit ? "error" : "textPrimary"}
          >
            {titleCharacterCount}/{MAX_TITLE_CHARACTERS} characters
          </Typography>
          <TextField
            type="text"
            margin="normal"
            label="Post Image"
            placeholder="Post Image - place your image url here"
            variant="outlined"
            name="image"
            fullWidth
            value={post?.image}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddAPhotoIcon />
                </InputAdornment>
              ),
            }}
          />
          {!isImageValid && (
            <Typography variant="caption" color="error">
              Invalid image URL. Please provide a valid image URL.
            </Typography>
          )}
          {post?.image && isImageValid && (
            <img
              src={post?.image}
              width="100%"
              alt="post image"
              onError={handleImageError}
            />
          )}

          <TextareaAutosize
            type="text"
            margin="normal"
            label="Title"
            variant="outlined"
            name="content"
            placeholder="Content"
            minRows={10}
            value={post?.content}
            onChange={handleChange}
            style={{
              width: "100%",
              marginTop: "10px",
              resize: "vertical",
            }}
          />

          <Typography
            variant="caption"
            sx={{ justifyContent: "flex-end" }}
            color={isContentOverLimit ? "error" : "textPrimary"}
          >
            {contentCharacterCount}/{MAX_CONTENT_CHARACTERS} characters
          </Typography>

          <section
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              sx={{
                backgroundColor: "#2074d4",
                color: "white",
                "&:hover": { backgroundColor: "#2074d4" },
              }}
              disabled={
                !post.title || !post.image || !post.content || !isImageValid
              }
              onClick={handleUpdatePost}
            >
              Update Post
            </Button>
            <Button
              sx={{
                backgroundColor: "red",
                color: "white",
                "&:hover": { backgroundColor: "red" },
              }}
              onClick={() => navigate("/")}
            >
              Discard
            </Button>
          </section>
        </Paper>
      </section>
    </Layout>
  );
};

export default EditPost;

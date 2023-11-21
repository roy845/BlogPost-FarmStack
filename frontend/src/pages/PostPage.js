import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deletePostById, getPost } from "../Api/ServerAPI";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Layout from "../components/Layout";
import { Avatar, Button, CardActions, Tooltip } from "@mui/material";
import AlertDialog from "../components/AletDialog";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";

const PostPage = () => {
  const [post, setPost] = useState({});
  const { postId } = useParams();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await getPost(postId);
        setPost(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [postId]);

  const deletePost = async () => {
    try {
      await deletePostById(postId);
      toast.success("Post deleted Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      setAuth(null);
      localStorage.removeItem("auth");
      navigate("/");
    }
  };

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleUpdatePost = () => {
    navigate(`/editPost/${postId}`);
  };

  return (
    <Layout title="Post">
      <Card sx={{ margin: "30px" }}>
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{ marginTop: "10px", marginBottom: "10px" }}
          >
            {post?.Post?.title}
          </Typography>
          <Tooltip title={post?.Post?.owner?.username}>
            <Link to={`/profile/${post?.Post?.owner?.username}`}>
              <Avatar
                src={post?.Post?.owner?.profilePicture}
                sx={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  cursor: "pointer",
                }}
              />
            </Link>
          </Tooltip>
        </section>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {post?.Post?.image && (
              <CardMedia
                component="img"
                alt="Post Image"
                height="100%"
                image={post?.Post?.image}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                overflow: "auto",
                maxHeight: "500px",
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="body2"
                  fontSize={28}
                  color="text.secondary"
                >
                  {post?.Post?.content}
                </Typography>
              </CardContent>
            </Paper>
            <CardActions></CardActions>
          </Grid>
        </Grid>
        {auth?.user?.id === post?.Post?.owner_id && (
          <section
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <Button
              sx={{
                backgroundColor: "#2074d4",
                color: "white",
                "&:hover": { backgroundColor: "#2074d4" },
              }}
              onClick={handleUpdatePost}
            >
              Update
            </Button>
            <Button
              sx={{
                backgroundColor: "red",
                color: "white",
                "&:hover": { backgroundColor: "red" },
              }}
              onClick={handleOpenDeleteModal}
            >
              Delete
            </Button>
          </section>
        )}
      </Card>
      {openDeleteModal && (
        <AlertDialog
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          title="Are you sure do you want to delete this post ?"
          content="This action will be irreversible"
          handleFunction={deletePost}
        />
      )}
    </Layout>
  );
};

export default PostPage;

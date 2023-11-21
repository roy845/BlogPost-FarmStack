import { useEffect, useState } from "react";
import { getAllPosts, getTotalPostCount } from "../Api/ServerAPI";

import { Button, Grid } from "@mui/material";
import { useSearch } from "../context/search";
import { debounce } from "lodash";
import NoItems from "./NoItems";
import Post from "./Post/Post";

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const { searchQuery } = useSearch();

  const debouncedPostsSearch = debounce(async (query, page) => {
    try {
      const { data } = await getAllPosts(query, page);

      setPosts(data);
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  }, 500);

  useEffect(() => {
    setPage(1);
    debouncedPostsSearch(searchQuery, 1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchTotalPostCount = async () => {
      try {
        const { data } = await getTotalPostCount();
        setTotalCount(data.post_count);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTotalPostCount();
  }, []);

  const loadMore = async () => {
    try {
      const { data } = await getAllPosts(searchQuery, page + 1);

      if (data.length > 0) {
        setPosts([...posts, ...data]);
        setPage(page + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onLoadMore = async (e) => {
    e.preventDefault();
    loadMore();
  };

  return (
    <>
      <Grid container spacing={2}>
        {posts.length === 0 ? (
          <Grid item xs={12}>
            <NoItems type="Posts" />
          </Grid>
        ) : (
          posts.map((post, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Post post={post} />
            </Grid>
          ))
        )}
      </Grid>
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {posts.length < totalCount && posts.length > 0 && (
          <Button onClick={onLoadMore} style={{ margin: "auto" }}>
            Load more
          </Button>
        )}
      </section>
    </>
  );
};

export default PostsList;

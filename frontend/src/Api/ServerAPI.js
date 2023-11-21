import axios from "axios";

export const BASE_URL = "http://localhost:8000/";

export const API_URLS = {
  login: `${BASE_URL}auth/login`,
  register: `${BASE_URL}users/`,
  updateProfile: `${BASE_URL}users/`,
  forgotPassword: `${BASE_URL}auth/forgotpassword`,
  resetPassword: `${BASE_URL}auth/resetpassword`,
  getUserByUsername: `${BASE_URL}users/getUserByUsername/`,
  createPost: `${BASE_URL}posts/`,
  checktokenexpiration: `${BASE_URL}auth/checktokenexpiration`,
  getAllPosts: `${BASE_URL}posts`,
  getPost: `${BASE_URL}posts/`,
  deletePostById: `${BASE_URL}posts/`,
  updatePost: `${BASE_URL}posts/`,
  getTotalPostCount: `${BASE_URL}posts/count`,
  likePost: `${BASE_URL}vote/`,
  likeComment: `${BASE_URL}voteComment/`,
  getAllPostlikes: `${BASE_URL}posts`,
  getAllCommentlikes: `${BASE_URL}comment`,
  getAllPostComments: `${BASE_URL}posts`,
  addComment: `${BASE_URL}comment/`,
  deleteComment: `${BASE_URL}comment/`,
  getComment: `${BASE_URL}comment/`,
  updateComment: `${BASE_URL}comment/`,
};

export const login = (formData) => {
  try {
    return axios.post(API_URLS.login, formData);
  } catch (error) {
    throw error;
  }
};

export const register = (user) => {
  try {
    return axios.post(API_URLS.register, user);
  } catch (error) {
    throw error;
  }
};

export const updateProfile = (userId, user) => {
  try {
    return axios.put(`${API_URLS.updateProfile}${userId}`, user);
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = (email) => {
  try {
    return axios.post(API_URLS.forgotPassword, { email });
  } catch (error) {
    throw error;
  }
};

export const resetPassword = (newPassword, token) => {
  try {
    return axios.post(API_URLS.resetPassword, { newPassword, token });
  } catch (error) {
    throw error;
  }
};

export const getUserByUsername = (username) => {
  try {
    return axios.get(`${API_URLS.getUserByUsername}${username}`);
  } catch (error) {
    throw error;
  }
};

export const createPost = (post) => {
  try {
    return axios.post(API_URLS.createPost, post);
  } catch (error) {
    throw error;
  }
};

export const checkTokenExpiration = () => {
  try {
    return axios.get(API_URLS.checktokenexpiration);
  } catch (error) {
    throw error;
  }
};

export const getAllPosts = (search, skip) => {
  try {
    return axios.get(`${API_URLS.getAllPosts}/?search=${search}&skip=${skip}`);
  } catch (error) {
    throw error;
  }
};

export const getPost = (postId) => {
  try {
    return axios.get(`${API_URLS.getPost}${postId}`);
  } catch (error) {
    throw error;
  }
};

export const deletePostById = (postId) => {
  try {
    return axios.delete(`${API_URLS.deletePostById}${postId}`);
  } catch (error) {
    throw error;
  }
};

export const updatePost = (postId, post) => {
  try {
    return axios.put(`${API_URLS.updatePost}${postId}`, post);
  } catch (error) {
    throw error;
  }
};

export const getTotalPostCount = () => {
  try {
    return axios.get(API_URLS.getTotalPostCount);
  } catch (error) {
    throw error;
  }
};

export const likePost = (post_id, dir) => {
  try {
    return axios.post(API_URLS.likePost, { post_id, dir });
  } catch (error) {
    throw error;
  }
};

export const likeComment = (comment_id, dir) => {
  try {
    return axios.post(API_URLS.likeComment, { comment_id, dir });
  } catch (error) {
    throw error;
  }
};

export const getAllPostlikes = (post_id) => {
  try {
    return axios.get(`${API_URLS.getAllPostlikes}/${post_id}/likes`);
  } catch (error) {
    throw error;
  }
};

export const getAllCommentlikes = (comment_id) => {
  try {
    return axios.get(`${API_URLS.getAllCommentlikes}/${comment_id}/likes`);
  } catch (error) {
    throw error;
  }
};

export const getAllPostComments = (post_id) => {
  try {
    return axios.get(`${API_URLS.getAllPostComments}/${post_id}/comments`);
  } catch (error) {
    throw error;
  }
};

export const addCommentToPost = (post_id, content) => {
  try {
    return axios.post(API_URLS.addComment, { post_id, content });
  } catch (error) {
    throw error;
  }
};

export const deleteComment = (comment_id) => {
  try {
    return axios.delete(`${API_URLS.deleteComment}${comment_id}`);
  } catch (error) {
    throw error;
  }
};

export const getComment = (comment_id) => {
  try {
    return axios.get(`${API_URLS.getComment}${comment_id}`);
  } catch (error) {
    throw error;
  }
};

export const updateComment = (comment_id, content) => {
  try {
    return axios.put(`${API_URLS.updateComment}${comment_id}`, { content });
  } catch (error) {
    throw error;
  }
};

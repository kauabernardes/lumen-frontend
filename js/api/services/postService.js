const postService = {
  async create(content, communityId) {
    return await window.api.post("/posts", { content, communityId });
  },

  async toggleLike(postId) {
    return await window.api.post(`/posts/${postId}/like`);
  },

  async getById(postId) {
    return await window.api.get(`/posts/${postId}`);
  },

  async addComment(postId, commentText) {
    return await window.api.post(`/posts/${postId}/comment`, {
      content: commentText,
    });
  },

  async getRecommendedPosts(page = 1, limit = 10) {
    return await window.api.get(
      `/posts/recommended?page=${page}&limit=${limit}`,
    );
  },
};

window.postService = postService;

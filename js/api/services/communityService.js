const communityService = {
  async create(name, description) {
    return await window.api.post("/community", { name, description });
  },

  async join(id) {
    return await window.api.post(`/community/${id}/join`);
  },

  async getRecommended(page = 1, limit = 10) {
    return await window.api.get(
      `/community/recommended?page=${page}&limit=${limit}`,
    );
  },

  async getById(id) {
    return await window.api.get(`/community/${id}`);
  },

  async getPosts(communityId, page = 1, limit = 10) {
    return await window.api.get(
      `/community/${communityId}/posts?page=${page}&limit=${limit}`,
    );
  },

  async getIn() {
    return await window.api.get(`/community/in`);
  },
};

window.communityService = communityService;

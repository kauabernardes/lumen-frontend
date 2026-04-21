/**
 * Serviço de Postagens para o projeto Lumen.
 * Gerencia a criação de posts e interações (likes).
 */

const postService = {
  /**
   * Cria uma nova postagem em uma comunidade.
   * @param {string} content - O texto da postagem.
   * @param {string} communityId - O ID da comunidade onde o post será publicado.
   * @returns {Promise<Object>}
   */
  async create(content, communityId) {
    return await window.api.post("/posts", { content, communityId });
  },

  /**
   * Alterna o "like" em uma postagem (curtir ou descurtir).
   * @param {string} postId - O ID da postagem.
   * @returns {Promise<Object>}
   */
  async toggleLike(postId) {
    return await window.api.post(`/posts/${postId}/like`);
  },
};

// Disponibiliza o serviço globalmente
window.postService = postService;

const agendaService = {
  async getEvents() {
    return await window.api.get(`/agenda/my`);
  },

  async create(payload) {
    return await window.api.post("/agenda", payload);
  },
  async del(id) {
    return await window.api.delete(`/agenda/${id}`);
  },
};

window.agendaService = agendaService;

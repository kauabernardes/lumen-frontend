const rewardService = {
  async getMy() {
    return await window.api.get(`/rewards`);
  },
};

window.rewardService = rewardService;

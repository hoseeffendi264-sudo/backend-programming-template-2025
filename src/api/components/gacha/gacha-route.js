const {
  gacha,
  getHistory,
  getPrizes,
  getWinners,
} = require('./gacha-controller');

module.exports = (router) => {
  router.post('/gacha', gacha);
  router.get('/gacha/history', getHistory);
  router.get('/gacha/prizes', getPrizes);
  router.get('/gacha/winners', getWinners);
};

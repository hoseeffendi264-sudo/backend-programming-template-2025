module.exports = (mongoose) => {
  const gachaSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    hadiah: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true },
  });

  return mongoose.model('Gacha', gachaSchema, 'gacha');
};

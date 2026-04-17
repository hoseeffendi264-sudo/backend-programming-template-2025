const { Gacha } = require('../../../models');

const hadiahList = [
  { nama: 'Emas 10 gram', kuota: 1 },
  { nama: 'Smartphone X', kuota: 5 },
  { nama: 'Smartwatch Y', kuota: 10 },
  { nama: 'Voucher Rp100.000', kuota: 100 },
  { nama: 'Pulsa Rp50.000', kuota: 500 },
];

function maskName(name) {
  if (!name || name.length <= 2) return '*'.repeat(name?.length || 1);
  const parts = name.split(' ');
  return parts
    .map((part) => {
      if (part.length <= 2) return '*'.repeat(part.length);
      return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
    })
    .join(' ');
}

exports.gacha = async (req, res, next) => {
  try {
    const { userId, userName } = req.body;
    if (!userId || !userName) {
      return res
        .status(400)
        .json({ message: 'userId dan userName diperlukan' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await Gacha.countDocuments({
      userId,
      createdAt: { $gte: today },
    });

    if (count >= 5) {
      return res.status(400).json({ message: 'Limit gacha hari ini habis' });
    }

    const randomIndex = Math.floor(Math.random() * hadiahList.length);
    const hadiahTerpilih = hadiahList[randomIndex];

    const totalMenang = await Gacha.countDocuments({
      hadiah: hadiahTerpilih.nama,
    });

    let hasil = 'Zonk';
    if (totalMenang < hadiahTerpilih.kuota) {
      hasil = hadiahTerpilih.nama;
    }

    await Gacha.create({
      userId,
      userName,
      hadiah: hasil,
    });

    res.json({ message: 'Gacha berhasil', hadiah: hasil });
  } catch (err) {
    next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId diperlukan' });
    }

    const history = await Gacha.find({ userId })
      .sort({ createdAt: -1 })
      .select('-_id userId userName hadiah createdAt');

    res.json({ data: history });
  } catch (err) {
    next(err);
  }
};

exports.getPrizes = async (req, res, next) => {
  try {
    const prizes = await Promise.all(
      hadiahList.map(async (h) => {
        const won = await Gacha.countDocuments({ hadiah: h.nama });
        return {
          nama: h.nama,
          kuota: h.kuota,
          tersisa: Math.max(0, h.kuota - won),
          sudahDimenangkan: won,
        };
      })
    );

    res.json({ data: prizes });
  } catch (err) {
    next(err);
  }
};

exports.getWinners = async (req, res, next) => {
  try {
    const { hadiah } = req.query;
    const filter = { hadiah: { $ne: 'Zonk' } };

    if (hadiah) {
      filter.hadiah = hadiah;
    }

    const winners = await Gacha.find(filter)
      .select('userName hadiah')
      .sort({ createdAt: -1 });

    const result = winners.map((w) => ({
      userName: maskName(w.userName),
      hadiah: w.hadiah,
    }));

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

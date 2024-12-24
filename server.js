const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Public dosyalar için

// Veri tabanı (örnek olarak bellek kullanımı)
let gruplar = [];

// Grup oluşturma
app.post('/grup-olustur', (req, res) => {
  const { isim, aciklama } = req.body;
  const davetKodu = Math.random().toString(36).substring(2, 8).toUpperCase();

  const yeniGrup = { id: Date.now(), isim, aciklama, davetKodu, uyeler: [] };
  gruplar.push(yeniGrup);

  res.status(200).json({ mesaj: "Grup oluşturuldu.", grupID: yeniGrup.id, davetKodu });
});

// Gruba katılma
app.post('/gruba-katil', (req, res) => {
  const { davetKodu, kullaniciID } = req.body;
  const grup = gruplar.find((g) => g.davetKodu === davetKodu);

  if (!grup) return res.status(404).json({ mesaj: "Geçersiz davet kodu." });

  if (!grup.uyeler.includes(kullaniciID)) grup.uyeler.push(kullaniciID);

  res.status(200).json({ mesaj: "Gruba katıldınız.", grupID: grup.id });
});

// Socket.IO mesajlaşma
io.on('connection', (socket) => {
  console.log('Kullanıcı bağlandı:', socket.id);

  socket.on('mesaj-gonder', ({ grupID, mesaj }) => {
    io.emit(`grup-${grupID}`, mesaj); // Mesajı gruptaki tüm kullanıcılara ilet
  });

  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
  });
});

// Sunucu başlatma
server.listen(3000, () => {
  console.log('Sunucu çalışıyor: http://localhost:3000/sohbet/');
});
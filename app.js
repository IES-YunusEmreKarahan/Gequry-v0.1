const socket = io('http://localhost:3000');

// Grup oluşturma
if (document.getElementById('grup-olustur-form')) {
  document.getElementById('grup-olustur-form').onsubmit = async (e) => {
    e.preventDefault();
    const isim = document.getElementById('isim').value;
    const aciklama = document.getElementById('aciklama').value;

    const response = await fetch('/grup-olustur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isim, aciklama }),
    });

    const data = await response.json();
    alert(`Grup oluşturuldu! Davet Kodu: ${data.davetKodu}`);
  };
}

// Gruba katılma
if (document.getElementById('gruba-katil-form')) {
  document.getElementById('gruba-katil-form').onsubmit = async (e) => {
    e.preventDefault();
    const davetKodu = document.getElementById('davetKodu').value;

    const response = await fetch('/gruba-katil', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ davetKodu, kullaniciID: 'kullanici-123' }),
    });

    const data = await response.json();
    if (data.mesaj === "Gruba katıldınız.") {
      window.location.href = `grup.html?grupID=${data.grupID}`;
    } else {
      alert(data.mesaj);
    }
  };
}

// Mesaj gönderme
function mesajGonder() {
  const mesaj = document.getElementById('mesaj').value;
  const grupID = new URLSearchParams(window.location.search).get('grupID');
  socket.emit('mesaj-gonder', { grupID, mesaj });
}

// Gelen mesajları dinleme
const grupID = new URLSearchParams(window.location.search).get('grupID');
if (grupID) {
  socket.on(`grup-${grupID}`, (mesaj) => {
    const mesajlarDiv = document.getElementById('mesajlar');
    const yeniMesaj = document.createElement('p');
    yeniMesaj.textContent = mesaj;
    mesajlarDiv.appendChild(yeniMesaj);
  });
}
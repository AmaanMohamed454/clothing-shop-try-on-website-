const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://babu-bridal-corner.vercel.app';
const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}`;

const filePath = path.join(__dirname, 'Babu_Bridal_Corner_QRCode.png');
const file = fs.createWriteStream(filePath);

https.get(apiUrl, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log(`QR Code successfully generated: ${filePath}`);
  });
}).on('error', (err) => {
  fs.unlink(filePath, () => {});
  console.error(`Error downloading QR code: ${err.message}`);
});

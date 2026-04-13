const fs = require('fs');
const https = require('https');

const apiKey = 'AIzaSyBGr0ehbhwm8Y4GHEJ2HcyYruL1Ko73-tE';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const dummyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; // 1x1 pixel

const payload = JSON.stringify({
  contents: [{
    parts: [
      { text: "Describe this image" },
      { inline_data: { mime_type: 'image/png', data: dummyBase64 } }
    ]
  }]
});

const req = https.request(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', e => console.error(e));
req.write(payload);
req.end();

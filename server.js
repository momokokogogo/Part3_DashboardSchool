const express = require('express');
const cors = require('cors');
const https = require('https');
const zlib = require('zlib');

const app = express();
app.use(cors());

app.get('/proxy', async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send('Missing URL');

  console.log("🔗 Fetching:", target);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(target, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Encoding': 'gzip, deflate',
        'Accept': 'text/html',
      },
      agent: new https.Agent({ rejectUnauthorized: false })
    });

    clearTimeout(timeout);

    if (!response.ok) return res.status(response.status).send('Proxy error: ' + response.statusText);

    const buffer = await response.arrayBuffer();
    const compressed = zlib.gzipSync(Buffer.from(buffer));
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Type', 'text/html');
    res.send(compressed);

  } catch (err) {
    console.error("❌ Proxy error:", err.message);
    res.status(500).send('Proxy error: ' + err.message);
  }
});

app.listen(26543, () => {
  console.log('🚀 Synthwave proxy running on port 26543');
});
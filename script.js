function formatURL(raw) {
  const url = raw.trim();
  return /^https?:\/\//.test(url) ? url : "https://" + url;
}

const goBtn = document.getElementById("go");
const urlInput = document.getElementById("url");
const loader = document.getElementById("loader");
const statusBar = document.getElementById("status");
const proxyFrame = document.getElementById("proxyFrame");
const terminalLog = document.getElementById("terminalLog");

// Terminal logger
function log(msg) {
  if (terminalLog) terminalLog.textContent += `> ${msg}\n`;
}

// Hide boot splash after delay
window.onload = () => {
  const splash = document.getElementById("bootSplash");
  setTimeout(() => splash.style.display = "none", 2000);
};

goBtn.onclick = async () => {
  const target = formatURL(urlInput.value);
  loader.style.display = "block";
  statusBar.textContent = "🔄 Connecting…";
  log(`Requested: ${target}`);

  const t0 = performance.now();

  try {
    const response = await fetch(`http://localhost:26543/proxy?url=${encodeURIComponent(target)}`);
    if (!response.ok) throw new Error(`Status ${response.status} ${response.statusText}`);
    const blob = await response.blob();

    const blobURL = URL.createObjectURL(blob);
    proxyFrame.src = blobURL;
    proxyFrame.style.display = "block";

    const t1 = performance.now();
    const elapsed = ((t1 - t0) / 1000).toFixed(2);
    loader.style.display = "none";
    statusBar.textContent = `✅ Loaded in ${elapsed}s`;
    log(`Success: ${target} loaded in ${elapsed}s`);
  } catch (err) {
    loader.style.display = "none";
    statusBar.textContent = `❌ Proxy error: ${err.message}`;
    log(`Error: ${err.message}`);
  }
};
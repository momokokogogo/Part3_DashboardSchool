const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");
const clickSound = document.getElementById("clickSound");

// Play retro sound on interaction
function playFX() {
  if (clickSound) clickSound.play();
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    playFX();
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));
    tab.classList.add("active");

    const targetId = tab.dataset.tab;
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) targetPanel.classList.add("active");
  });
});

// Settings tab controls
const themeSwitch = document.getElementById("themeSwitch");
const debugToggle = document.getElementById("debugToggle");
const resetProxy = document.getElementById("resetProxy");

if (localStorage.getItem("theme") === "synthwave") {
  document.body.classList.add("synthwave");
  if (themeSwitch) themeSwitch.checked = true;
}

if (themeSwitch) {
  themeSwitch.onchange = () => {
    if (themeSwitch.checked) {
      document.body.classList.add("synthwave");
      localStorage.setItem("theme", "synthwave");
    } else {
      document.body.classList.remove("synthwave");
      localStorage.setItem("theme", "default");
    }
  };
}

if (debugToggle) {
  debugToggle.onchange = () => {
    alert(debugToggle.checked ? "🧪 Debug logs enabled" : "🚫 Debug logs disabled");
  };
}

if (resetProxy) {
  resetProxy.onclick = () => location.reload();
}
const difficultyToggle = document.getElementById("difficultyToggle");
const acceptanceToggle = document.getElementById("acceptanceToggle");

// 1️⃣ Load saved states (default to true)
chrome.storage.sync.get(
  { hideDifficulty: true, hideAcceptance: true },
  (data) => {
    difficultyToggle.checked = data.hideDifficulty;
    acceptanceToggle.checked = data.hideAcceptance;
    // Notify content script on popup open so it can apply right away
    sendToggleChange(data.hideDifficulty, data.hideAcceptance);
  }
);

// 2️⃣ Save & notify on change
difficultyToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ hideDifficulty: difficultyToggle.checked });
  sendToggleChange(difficultyToggle.checked, acceptanceToggle.checked);
});


acceptanceToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ hideAcceptance: acceptanceToggle.checked });
  sendToggleChange(difficultyToggle.checked, acceptanceToggle.checked);
});


// 3️⃣ Helper to send message to content.js
function sendToggleChange(hideDifficulty, hideAcceptance) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.id) return;
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "TOGGLE_METADATA",
      hideDifficulty,
      hideAcceptance,
    });
  });
}

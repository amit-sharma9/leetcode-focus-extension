// 2️⃣ Apply or remove hides based on flags
function applySettings({ hideDifficulty, hideAcceptance }) {
  if (hideDifficulty) {
    hidedifficulty();
  } else {
    // reload page or implement showDifficulty() if you want revert in-live
    showDifficulty();
  }
  if (hideAcceptance) {
    hideAcceptanceRate();
  } else {
    showAcceptanceRate();
  }
}

// MutationObserver setup
// Fetch user preferences from storage
// 3️⃣ Initial load: read storage and apply immediately
chrome.storage.sync.get(
  { hideDifficulty: true, hideAcceptance: true },
  (settings) => {
    applySettings(settings);
    // 4️⃣ Observe for dynamic changes
    const observer = new MutationObserver(() => applySettings(settings));
    observer.observe(document.body, { childList: true, subtree: true });
  }
);

// 5️⃣ Live toggle: listen for messages from popup.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TOGGLE_METADATA") {
    applySettings({
      hideDifficulty: message.hideDifficulty,
      hideAcceptance: message.hideAcceptance,
    });
  }
});
// 💡 This function hides difficulty tags
function hidedifficulty() {
  console.log("🔍 Running hidedifficulty...");

  const classparts = [
    "text-difficulty-easy",
    "text-difficulty-medium",
    "text-difficulty-hard",
    "text-sd-easy",
    "text-sd-medium",
    "text-sd-hard",
  ];

  let somethingHidden = false;

  classparts.forEach((classname) => {
    const elements = document.querySelectorAll(`[class*="${classname}"]`);
    if (elements.length > 0) somethingHidden = true;

    elements.forEach((el) => (el.style.display = "none"));
  });

  return somethingHidden;
}

function hideAcceptanceRate() {
  let hidden = false;

  const conatainers = document.querySelectorAll("div.flex.items-center.gap-2");

  conatainers.forEach((block) => {
    const label = block.querySelector("div.text-sd-muted-foreground");
    if (!label) return;
    const labeltext = label.textContent.trim();

    if (labeltext === "Accepted" || labeltext === "Acceptance Rate") {
      block.style.display = "none";
      hidden = true;
    }
  });

  /// In the other page where no text so we have to
  document.querySelectorAll("div.text-sd-muted-foreground").forEach((el) => {
    if (el.textContent.includes("%")) {
      el.style.display = "none";
      hidden = true;
    }
  });

  return hidden;
}

//TO Reappear everything when toggle goes off
// 💡 This function shows difficulty tags again
function showDifficulty() {
  const classparts = [
    "text-difficulty-easy",
    "text-difficulty-medium",
    "text-difficulty-hard",
    "text-sd-easy",
    "text-sd-medium",
    "text-sd-hard",
  ];
  classparts.forEach((classname) => {
    document
      .querySelectorAll(`[class*="${classname}"]`)
      .forEach((el) => (el.style.display = ""));
  });
}

// 💡 This function shows acceptance metadata again
function showAcceptanceRate() {
  // show labeled blocks
  document.querySelectorAll("div.flex.items-center.gap-2").forEach((block) => {
    const label = block.querySelector("div.text-sd-muted-foreground");
    if (label) {
      const txt = label.textContent.trim();
      if (txt === "Accepted" || txt === "Acceptance Rate") {
        block.style.display = "";
      }
    }
  });
  // show standalone percentages
  document.querySelectorAll("div.text-sd-muted-foreground").forEach((el) => {
    if (el.textContent.includes("%")) {
      el.style.display = "";
    }
  });
}

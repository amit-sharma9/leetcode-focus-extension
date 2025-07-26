// ————————————————————————————
// 1️⃣ Global state for toggles
// ————————————————————————————
let hideDiff = true;
let hideAccept = true;


// ————————————————————————————
// 2️⃣ Core hide/show functions (unchanged)
// ————————————————————————————
function hidedifficulty() {
  

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


// ————————————————————————————
// 3️⃣ Apply current flags
// ————————————————————————————
function applySettings() {
  if (hideDiff) hidedifficulty();
  else showDifficulty();

  if (hideAccept) hideAcceptanceRate();
  else showAcceptanceRate();
}


// ————————————————————————————
// 4️⃣ Observer that always reads globals
// ————————————————————————————
const observer = new MutationObserver(applySettings);
observer.observe(document.body, { childList: true, subtree: true });




// ————————————————————————————
// 5️⃣ Initial load: read storage into globals, then apply
// ————————————————————————————
chrome.storage.sync.get(
  { hideDifficulty: true, hideAcceptance: true },
  (settings) => {
    hideDiff   = settings.hideDifficulty;
    hideAccept = settings.hideAcceptance;
    applySettings();
  }
);



// ————————————————————————————
// 6️⃣ Live toggle: update globals on message and re‑apply
// ————————————————————————————
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TOGGLE_METADATA") {
    hideDiff   = message.hideDifficulty;
    hideAccept = message.hideAcceptance;
    applySettings();
  }
});





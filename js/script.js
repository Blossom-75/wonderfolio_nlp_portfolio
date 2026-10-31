const activities = [
  { id: "hands-on-session-1", number: 1, name: "Hands-on Session 1", icon: "📝", short: "NLTK and text analysis", description: "Explore tokenization, corpora, frequency distributions, stopwords and word clouds." },
  { id: "hands-on-session-2", number: 2, name: "Hands-on Session 2", icon: "📒", short: "Classification and text features", description: "Explore a Naive Bayes name classifier, bag-of-words features and cosine similarity." },
  { id: "web-scraping", number: 3, name: "Web Scraping", icon: "🕸️", short: "Article collection and text analysis", description: "Explore a Python workflow for collecting and analysing online article text." },
  { id: "fsa-in-tamil", number: 4, name: "FSA in Tamil", icon: "🔤", short: "Finite-state and Tamil morphology", description: "Explore the uploaded FSA diagram and Tamil morphotactics notes." },
  { id: "definitions", number: 5, name: "Definitions", icon: "📚", short: "Language and writing terminology", description: "Review the terminology captured in the handwritten notes." },
  { id: "health-map", number: 6, name: "Health Map", icon: "🗺️", short: "Disease-aware healthcare discovery", description: "Explore the proposed NLP-powered healthcare recommendation system." },
  { id: "translation", number: 7, name: "Translation", icon: "🌐", short: "Tamil poem translation comparison", description: "Compare two English translations and their evaluation scores." },
  { id: "project", number: 8, name: "Project", icon: "💬", short: "My NLP project", description: "Explore my Natural Language Processing project." },
  { id: "stars", number: 9, name: "Stars", icon: "⭐", short: "Handwritten working and notes", description: "View the uploaded handwritten calculations and notes for this activity." }
];

const activityPages = {
  "hands-on-session-1": "activities/hands-on-session-1/index.html",
  "hands-on-session-2": "activities/hands-on-session-2/index.html",
  "web-scraping": "activities/web-scraping/index.html",
  "fsa-in-tamil": "activities/fsa-in-tamil/index.html",
  "definitions": "activities/definitions/index.html",
  "health-map": "activities/health-map/index.html",
  "translation": "activities/translation/index.html",
  "project": "activities/project/index.html",
  "stars": "activities/stars/index.html"
};

const machine = document.querySelector(".machine");
const products = [...document.querySelectorAll(".product")];
const selectedIcon = document.getElementById("selectedIcon");
const selectedName = document.getElementById("selectedName");
const selectedCode = document.getElementById("selectedCode");
const dispenseButton = document.getElementById("dispenseButton");
const collectionPit = document.getElementById("collectionPit");
const pitEmpty = document.getElementById("pitEmpty");
const toast = document.getElementById("toast");
const keypad = document.getElementById("keypad");

let selectedActivity = null;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function selectActivity(activity) {
  selectedActivity = activity;
  products.forEach((product) => {
    const active = product.dataset.activity === activity.id;
    product.setAttribute("aria-pressed", String(active));
  });
  selectedIcon.textContent = activity.icon;
  selectedName.textContent = activity.name;
  selectedCode.textContent = `NO. ${String(activity.number).padStart(2, "0")}`;
}

products.forEach((product) => {
  product.addEventListener("click", () => {
    const activity = activities.find((item) => item.id === product.dataset.activity);
    if (activity) selectActivity(activity);
  });
});

keypad.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;
    if (number === "clear") {
      selectedActivity = null;
      products.forEach((product) => product.setAttribute("aria-pressed", "false"));
      selectedIcon.textContent = "✦";
      selectedName.innerHTML = "Choose an<br>activity";
      selectedCode.textContent = "NO. --";
      return;
    }
    const activity = activities.find((item) => item.number === Number(number));
    if (activity) selectActivity(activity);
  });
});

function openActivity(activity) {
  const page = activityPages[activity.id];

  if (page) {
    window.location.href = page;
  } else {
    showToast("Activity page is not available yet ♡");
  }
}

function dispense() {
  if (!selectedActivity) {
    showToast("Choose an activity first ♡");
    return;
  }

  machine.classList.remove("dispensing");
  void machine.offsetWidth;
  machine.classList.add("dispensing");
  dispenseButton.disabled = true;

  const activity = selectedActivity;
  pitEmpty.hidden = true;

  const item = document.createElement("button");
  item.className = "collected-item";
  item.type = "button";
  item.setAttribute("aria-label", `Open ${activity.name}`);
  item.innerHTML = `
    <span class="collected-icon">${activity.icon}</span>
    <span class="collected-title">${activity.name}</span>
    <span class="collected-number">ITEM ${String(activity.number).padStart(2, "0")} · CLICK TO OPEN</span>
  `;
  item.addEventListener("click", () => openActivity(activity));

  collectionPit.appendChild(item);
  showToast(`${activity.name} dispensed! Click the item to open it ♡`);

  setTimeout(() => {
    dispenseButton.disabled = false;
    machine.classList.remove("dispensing");
  }, 750);
}

dispenseButton.addEventListener("click", dispense);

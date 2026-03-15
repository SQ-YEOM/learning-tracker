const STORAGE_KEY = "learning-tracker-data";

const JSONBIN_BIN_ID = "69b698c2c3097a1dd5289681";
const JSONBIN_API_KEY = "$2a$10$H7b8j9L7HHMERBMemoSY4en2PF0NQmvEnLP7ja9PKC2irTLUtfK0u";

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function isAdminPage() {
  return document.body && document.body.classList.contains("admin");
}

function getJsonBinUrl() {
  return `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
}

async function fetchData() {
  const headers = {};
  headers["X-Master-Key"] = JSONBIN_API_KEY;
  const response = await fetch(getJsonBinUrl(), { headers, cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load data");
  }
  const payload = await response.json();
  return payload.record || { classes: [] };
}

async function loadData() {
  if (isAdminPage()) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.warn("Failed to parse saved data, falling back to remote.", error);
      }
    }
  }

  try {
    const remote = await fetchData();
    if (isAdminPage()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
    }
    return cloneData(remote);
  } catch (error) {
    console.warn("Failed to load jsonbin data, falling back to empty.", error);
  }

  return { classes: [] };
}

async function saveData(data) {
  data.updatedAt = new Date().toISOString().slice(0, 10);
  if (isAdminPage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  const response = await fetch(getJsonBinUrl(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": JSONBIN_API_KEY
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Failed to save data");
  }
}

window.DATA_STORE = {
  loadData,
  saveData
};

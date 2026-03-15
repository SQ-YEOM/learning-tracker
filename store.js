const STORAGE_KEY = "learning-tracker-data";

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function isAdminPage() {
  return document.body && document.body.classList.contains("admin");
}

async function fetchData() {
  const response = await fetch("./data.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load data");
  }
  return response.json();
}

async function loadData() {
  if (isAdminPage()) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.warn("Failed to parse saved data, falling back to data.json.", error);
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
    console.warn("Failed to load data.json, falling back to empty.", error);
  }

  return { classes: [] };
}

async function saveData(data) {
  data.updatedAt = new Date().toISOString().slice(0, 10);
  if (isAdminPage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

window.DATA_STORE = {
  loadData,
  saveData
};

const STORAGE_KEY = "learning-tracker-data";

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.warn("Failed to parse saved data, falling back to defaults.", error);
    }
  }
  return cloneData(DEFAULT_STUDENT_DATA || { classes: [] });
}

function saveData(data) {
  data.updatedAt = new Date().toISOString().slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

window.DATA_STORE = {
  loadData,
  saveData
};

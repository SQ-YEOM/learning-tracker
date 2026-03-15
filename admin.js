const studentListNav = document.querySelector("#studentListNav");
const adminStudentName = document.querySelector("#adminStudentName");
const adminSubtitle = document.querySelector("#adminSubtitle");
const updatedAt = document.querySelector("#updatedAt");
const studentNameInput = document.querySelector("#studentNameInput");
const teacherNotes = document.querySelector("#teacherNotes");
const classSelect = document.querySelector("#classSelect");
const curriculumSelect = document.querySelector("#curriculumSelect");
const curriculumNames = document.querySelector("#curriculumNames");
const booksContainer = document.querySelector("#booksContainer");
const addBookButton = document.querySelector("#addBookButton");
const saveButton = document.querySelector("#saveButton");
const saveHelper = document.querySelector("#saveHelper");
const addStudentButton = document.querySelector("#addStudentButton");
const deleteStudentButton = document.querySelector("#deleteStudentButton");
const classNameInput = document.querySelector("#classNameInput");
const addClassButton = document.querySelector("#addClassButton");
const classList = document.querySelector("#classList");
const classHelper = document.querySelector("#classHelper");

let data = { classes: [] };
let activeStudentId = null;

function normalizeName(value) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function getAllStudents() {
  return data.classes.flatMap((group) =>
    group.students.map((student) => ({ student, group }))
  );
}

function renderStudentList() {
  studentListNav.innerHTML = getAllStudents()
    .map(({ student, group }) => {
      const activeClass = student.id === activeStudentId ? "is-active" : "";
      return `
        <button class="student-item ${activeClass}" data-id="${student.id}">
          <div>${student.name}</div>
          <div class="student-meta">${group.name}</div>
        </button>
      `;
    })
    .join("");
}

function findStudentById(studentId) {
  for (const group of data.classes) {
    const student = group.students.find((item) => item.id === studentId);
    if (student) {
      return { student, group };
    }
  }
  return null;
}

function renderClassOptions() {
  classSelect.innerHTML = data.classes
    .map((group) => `<option value="${group.id}">${group.name}</option>`)
    .join("");
}

function renderClassList() {
  classList.innerHTML = data.classes
    .map((group) => {
      const hasStudents = group.students.length > 0;
      return `
        <div class="class-item">
          <span>${group.name}</span>
          <button type="button" data-id="${group.id}" ${hasStudents ? "disabled" : ""}>삭제</button>
        </div>
      `;
    })
    .join("");
}

function renderCurriculumButtons(curriculum) {
  const steps = curriculum.steps || ["1단계", "2단계", "3단계", "4단계", "5단계"];
  curriculumSelect.innerHTML = steps
    .map((step, index) => {
      const stepNumber = index + 1;
      const isActive = stepNumber === curriculum.current;
      return `<button type="button" class="${isActive ? "is-active" : ""}" data-step="${stepNumber}">${step}</button>`;
    })
    .join("");
}

function renderCurriculumNames(curriculum) {
  const steps = curriculum.steps || ["기초", "핵심", "적용", "심화", "완성"];
  curriculumNames.innerHTML = steps
    .map(
      (step, index) =>
        `<input type="text" value="${step}" placeholder="단계 ${index + 1}" />`
    )
    .join("");
}

function renderBookRows(progress) {
  if (!progress.length) {
    progress.push({ book: "", total: 0, done: 0, homework: 0 });
  }

  booksContainer.innerHTML = progress
    .map((item, index) => {
      return `
        <div class="book-row" data-index="${index}">
          <input type="text" value="${item.book}" placeholder="교재명" />
          <input type="number" min="0" value="${item.total}" placeholder="전체" />
          <input type="number" min="0" value="${item.done}" placeholder="완료" />
          <input type="number" min="0" value="${item.homework}" placeholder="숙제" />
          <button class="remove-button" type="button">삭제</button>
        </div>
      `;
    })
    .join("");
}

function renderStudentForm(studentId) {
  const match = findStudentById(studentId);
  if (!match) {
    return;
  }

  const { student, group } = match;
  adminStudentName.textContent = student.name;
  adminSubtitle.textContent = `${group.name} 학생 정보 입력 중`;
  updatedAt.textContent = `업데이트: ${data.updatedAt}`;
  studentNameInput.value = student.name;
  teacherNotes.value = student.notes || "";
  classSelect.value = group.id;
  renderCurriculumButtons(student.curriculum || { steps: ["기초", "핵심", "적용", "심화", "완성"], current: 1 });
  renderCurriculumNames(student.curriculum || { steps: ["기초", "핵심", "적용", "심화", "완성"], current: 1 });
  renderBookRows(student.progress || []);
}

function setActiveStudent(studentId) {
  activeStudentId = studentId;
  renderStudentList();
  renderStudentForm(studentId);
}

function collectBooks() {
  const rows = Array.from(booksContainer.querySelectorAll(".book-row"));
  return rows
    .map((row) => {
      const inputs = row.querySelectorAll("input");
      const [bookInput, totalInput, doneInput, homeworkInput] = inputs;
      const book = bookInput.value.trim();
      const total = Number(totalInput.value) || 0;
      const done = Number(doneInput.value) || 0;
      const homework = Number(homeworkInput.value) || 0;
      if (!book && total === 0 && done === 0 && homework === 0) {
        return null;
      }
      return { book, total, done, homework };
    })
    .filter(Boolean);
}

function isDuplicateName(name, excludeId) {
  const normalized = normalizeName(name);
  return getAllStudents().some(
    ({ student }) =>
      student.id !== excludeId && normalizeName(student.name) === normalized
  );
}

function updateStudentData() {
  const match = findStudentById(activeStudentId);
  if (!match) {
    return false;
  }

  const { student, group } = match;
  const newName = studentNameInput.value.trim() || student.name;
  const selectedClassId = classSelect.value;

  if (isDuplicateName(newName, student.id)) {
    saveHelper.textContent = "동명이인은 추가할 수 없습니다. 이름을 변경해주세요.";
    return false;
  }

  student.name = newName;
  student.notes = teacherNotes.value.trim();
  student.progress = collectBooks();

  const activeStep = curriculumSelect.querySelector("button.is-active");
  const stepNumber = activeStep ? Number(activeStep.dataset.step) : 1;
  const customSteps = Array.from(curriculumNames.querySelectorAll("input"))
    .map((input) => input.value.trim())
    .filter((value) => value);
  const fallbackSteps = student.curriculum?.steps || ["기초", "핵심", "적용", "심화", "완성"];
  student.curriculum = {
    steps: customSteps.length ? customSteps : fallbackSteps,
    current: stepNumber
  };

  if (group.id !== selectedClassId) {
    const newGroup = data.classes.find((item) => item.id === selectedClassId);
    if (newGroup) {
      group.students = group.students.filter((item) => item.id !== student.id);
      newGroup.students.push(student);
    }
  }

  return true;
}

function createStudentId(name) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const fallback = `student-${Date.now()}`;
  const candidate = base || fallback;

  let suffix = 1;
  let nextId = candidate;
  const existingIds = new Set(getAllStudents().map(({ student }) => student.id));
  while (existingIds.has(nextId)) {
    suffix += 1;
    nextId = `${candidate}-${suffix}`;
  }
  return nextId;
}

function getUniqueName(baseName) {
  let suffix = 1;
  let candidate = baseName;
  while (isDuplicateName(candidate)) {
    suffix += 1;
    candidate = `${baseName} ${suffix}`;
  }
  return candidate;
}

function addStudent() {
  const group = data.classes[0];
  const uniqueName = getUniqueName("새 학생");
  const newStudent = {
    id: createStudentId(uniqueName),
    name: uniqueName,
    curriculum: { steps: ["기초", "핵심", "적용", "심화", "완성"], current: 1 },
    progress: [{ book: "", total: 0, done: 0, homework: 0 }]
  };
  group.students.push(newStudent);
  setActiveStudent(newStudent.id);
  studentNameInput.focus();
}


async function addClass() {
  const name = classNameInput.value.trim();
  if (!name) {
    classHelper.textContent = "반 이름을 입력해주세요.";
    return;
  }
  if (data.classes.some((group) => normalizeName(group.name) === normalizeName(name))) {
    classHelper.textContent = "이미 존재하는 반 이름입니다.";
    return;
  }
  const newClass = {
    id: `class-${Date.now()}`,
    name,
    students: []
  };
  data.classes.push(newClass);
  classNameInput.value = "";
  classHelper.textContent = "새 반이 추가되었습니다.";
  await window.DATA_STORE.saveData(data);
  renderClassOptions();
  renderClassList();
}

async function deleteClass(classId) {
  const target = data.classes.find((group) => group.id === classId);
  if (!target || target.students.length > 0) {
    classHelper.textContent = "학생이 있는 반은 삭제할 수 없습니다.";
    return;
  }
  data.classes = data.classes.filter((group) => group.id !== classId);
  classHelper.textContent = "반이 삭제되었습니다.";
  await window.DATA_STORE.saveData(data);
  renderClassOptions();
  renderClassList();
}

async function deleteStudent() {
  const match = findStudentById(activeStudentId);
  if (!match) {
    return;
  }
  const { student, group } = match;
  group.students = group.students.filter((item) => item.id !== student.id);
  activeStudentId = null;
  renderStudentList();
  renderClassOptions();
  if (getAllStudents().length) {
    setActiveStudent(getAllStudents()[0].student.id);
  } else {
    adminStudentName.textContent = "학생 없음";
    adminSubtitle.textContent = "학생을 추가해주세요.";
    updatedAt.textContent = `업데이트: ${data.updatedAt}`;
    studentNameInput.value = "";
    curriculumSelect.innerHTML = "";
    curriculumNames.innerHTML = "";
    booksContainer.innerHTML = "";
  }
  await window.DATA_STORE.saveData(data);
}

studentListNav.addEventListener("click", (event) => {
  const button = event.target.closest(".student-item");
  if (button) {
    setActiveStudent(button.dataset.id);
  }
});

curriculumSelect.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  curriculumSelect.querySelectorAll("button").forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");
});

booksContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-button");
  if (!button) {
    return;
  }
  const row = button.closest(".book-row");
  row.remove();
});

addBookButton.addEventListener("click", () => {
  const newRow = document.createElement("div");
  newRow.className = "book-row";
  newRow.innerHTML = `
    <input type="text" placeholder="교재명" />
    <input type="number" min="0" placeholder="전체" />
    <input type="number" min="0" placeholder="완료" />
    <input type="number" min="0" placeholder="숙제" />
    <button class="remove-button" type="button">삭제</button>
  `;
  booksContainer.appendChild(newRow);
});

saveButton.addEventListener("click", async () => {
  if (!activeStudentId) {
    return;
  }
  const updated = updateStudentData();
  if (!updated) {
    return;
  }
  try {
    await window.DATA_STORE.saveData(data);
    saveHelper.textContent = "저장되었습니다. 학생 페이지에서 새 데이터를 확인하세요.";
  } catch (error) {
    console.error(error);
    saveHelper.textContent = "저장 실패: jsonbin 연결을 확인해주세요.";
  }
  renderStudentList();
  renderStudentForm(activeStudentId);
});

addStudentButton.addEventListener("click", addStudent);
deleteStudentButton.addEventListener("click", deleteStudent);
addClassButton.addEventListener("click", addClass);

classList.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  await deleteClass(button.dataset.id);
});

async function init() {
  data = await window.DATA_STORE.loadData();
  renderClassOptions();
  renderClassList();
  renderStudentList();
  if (getAllStudents().length) {
    setActiveStudent(getAllStudents()[0].student.id);
  }
}

init();

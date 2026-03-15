const trackerContent = document.querySelector("#trackerContent");
const studentSearch = document.querySelector("#studentSearch");
const studentList = document.querySelector("#studentList");
const searchHelper = document.querySelector("#searchHelper");

const data = window.DATA_STORE.loadData();

function normalizeName(value) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function getAllStudents() {
  return data.classes.flatMap((group) =>
    group.students.map((student) => ({ student, group }))
  );
}

function updateDatalist() {
  const options = getAllStudents()
    .map(({ student }) => `<option value="${student.name}"></option>`)
    .join("");
  studentList.innerHTML = options;
}

function findMatches(query) {
  if (!query) {
    return [];
  }
  const normalized = normalizeName(query);
  return getAllStudents().filter(({ student }) =>
    normalizeName(student.name).includes(normalized)
  );
}

function renderProgress(progress) {
  return progress
    .map((item) => {
      const remaining = Math.max(item.total - item.done - item.homework, 0);
      const donePercent = Math.round((item.done / item.total) * 100);
      const homeworkPercent = Math.round((item.homework / item.total) * 100);
      const remainingPercent = Math.max(100 - donePercent - homeworkPercent, 0);

      return `
        <article class="progress-card">
          <div class="progress-card__title">${item.book}</div>
          <div class="progress-meta">
            <span>완료 ${item.done}p / ${item.total}p</span>
            <span>숙제 ${item.done + item.homework}p까지</span>
          </div>
          <div class="progress-bar" aria-label="${item.book} 진행률">
            <span class="progress-bar__segment progress-bar__segment--done" style="width:${donePercent}%"></span>
            <span class="progress-bar__segment progress-bar__segment--homework" style="width:${homeworkPercent}%"></span>
            <span class="progress-bar__segment progress-bar__segment--rest" style="width:${remainingPercent}%"></span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCurriculum(curriculum) {
  const steps = curriculum.steps || ["1단계", "2단계", "3단계", "4단계", "5단계"];
  const currentIndex = Math.min(Math.max(curriculum.current || 1, 1), steps.length) - 1;
  const fillPercent = (currentIndex / (steps.length - 1)) * 100;

  const stepItems = steps
    .map((step, index) => {
      const classes = ["step"];
      if (index < currentIndex) {
        classes.push("is-complete");
      }
      if (index === currentIndex) {
        classes.push("is-active");
      }
      return `
        <div class="${classes.join(" ")}">
          <div class="step__dot"></div>
          <div>${step}</div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="stepper">
      <div class="stepper-track">
        <div class="stepper-track__fill" style="width:${fillPercent}%"></div>
      </div>
      <div class="stepper-steps stepper-steps--overlay">${stepItems}</div>
      <div class="stepper-info">
        <span>현재 단계: ${steps[currentIndex]}</span>
      </div>
    </div>
  `;
}

function renderStudent(match) {
  const { student, group } = match;

  trackerContent.innerHTML = `
    <section class="section-card">
      <div class="section-header">
        <div>
          <h2 class="section-title">${student.name} · ${group.name}</h2>
          <p class="muted">업데이트: ${data.updatedAt}</p>
        </div>
      </div>
      <div class="progress-grid">
        ${renderProgress(student.progress)}
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <div>
          <h2 class="section-title">커리큘럼</h2>
        </div>
      </div>
      ${renderCurriculum(student.curriculum)}
    </section>
  `;
}

function renderEmpty(message) {
  trackerContent.innerHTML = `
    <div class="empty-state">
      <h2>${message}</h2>
      <p class="muted">입력한 이름을 다시 확인해주세요.</p>
    </div>
  `;
}

function handleSearch() {
  const query = studentSearch.value.trim();
  if (!query) {
    searchHelper.textContent = "이름을 입력하면 자동으로 학생 정보를 불러옵니다.";
    trackerContent.innerHTML = `
      <div class="empty-state">
        <h2>학생 이름을 입력해주세요</h2>
        <p class="muted">동명이인이 있는 경우 전체 이름을 입력하세요.</p>
      </div>
    `;
    return;
  }

  const matches = findMatches(query);
  const exact = matches.find(
    ({ student }) => normalizeName(student.name) === normalizeName(query)
  );

  if (exact) {
    searchHelper.textContent = "학생 정보가 갱신되었습니다.";
    renderStudent(exact);
    return;
  }

  if (matches.length > 0) {
    searchHelper.textContent = "동명이인이 있어 정확한 이름을 입력해주세요.";
    renderEmpty("동명이인이 있습니다");
    return;
  }

  searchHelper.textContent = "해당 이름의 학생을 찾지 못했습니다.";
  renderEmpty("학생을 찾을 수 없습니다");
}

studentSearch.addEventListener("input", handleSearch);
studentSearch.addEventListener("change", handleSearch);

updateDatalist();

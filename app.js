const CALENDLY_URL = "https://calendly.com/hansu";

function populateFilters() {
  const countrySelect = document.getElementById("filter-country");
  const degreeSelect = document.getElementById("filter-degree");
  const studySelect = document.getElementById("filter-study");

  uniqueSorted(window.STUDENTS.map((s) => s.country)).forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    countrySelect.appendChild(option);
  });

  uniqueSorted(window.STUDENTS.map((s) => s.degreeLevel)).forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    degreeSelect.appendChild(option);
  });

  uniqueSorted(window.STUDENTS.map((s) => s.areaOfStudy)).forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    studySelect.appendChild(option);
  });
}

function getFilteredStudents() {
  const country = document.getElementById("filter-country").value;
  const degree = document.getElementById("filter-degree").value;
  const study = document.getElementById("filter-study").value;

  return window.STUDENTS.filter((student) => {
    if (country && student.country !== country) return false;
    if (degree && student.degreeLevel !== degree) return false;
    if (study && student.areaOfStudy !== study) return false;
    return true;
  });
}

function openCalendly(studentName) {
  const url = `${CALENDLY_URL}?name=${encodeURIComponent(studentName)}&utm_source=aicoffeechat&utm_medium=student_card`;

  if (typeof Calendly !== "undefined" && Calendly.initPopupWidget) {
    Calendly.initPopupWidget({ url });
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

function renderStudentCard(student) {
  const firstName = student.name.split(" ")[0];
  const hobbiesHtml = student.hobbies
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");

  return `
    <article class="student-card" data-id="${student.id}">
      <div class="card-top">
        <img class="avatar" src="${student.avatar}" alt="" width="72" height="72" loading="lazy" />
        <div class="card-identity">
          <div class="name-row">
            <h2>${student.name}</h2>
            <span class="flag" title="${student.country}">${flagEmoji(student.countryCode)}</span>
          </div>
          <p class="degree">${student.degree}</p>
          <p class="status">${student.status}</p>
        </div>
      </div>

      <button type="button" class="coffee-btn" data-student="${student.name}">
        Virtual Coffee Chat with ${firstName}
      </button>

      <div class="availability">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>${student.availability}</span>
      </div>

      <dl class="card-details">
        <div class="detail-row">
          <dt>I speak</dt>
          <dd>${student.languages.join(" · ")}</dd>
        </div>
        <div class="detail-row">
          <dt>Hobbies &amp; interests</dt>
          <dd class="tags">${hobbiesHtml}</dd>
        </div>
        <div class="detail-row">
          <dt>About me</dt>
          <dd class="about">${student.about}</dd>
        </div>
      </dl>

      <button type="button" class="read-more coffee-link" data-student="${student.name}">
        Schedule with ${firstName} on Calendly →
      </button>
    </article>
  `;
}

function render() {
  const students = getFilteredStudents();
  const grid = document.getElementById("student-grid");
  const empty = document.getElementById("empty-state");
  const resultsCount = document.getElementById("results-count");
  const clearBtn = document.getElementById("clear-filters");

  const hasFilters =
    document.getElementById("filter-country").value ||
    document.getElementById("filter-degree").value ||
    document.getElementById("filter-study").value;

  clearBtn.hidden = !hasFilters;
  resultsCount.textContent =
    students.length === window.STUDENTS.length
      ? `Showing all ${students.length} student ambassadors`
      : `${students.length} ambassador${students.length === 1 ? "" : "s"} match your filters`;

  if (students.length === 0) {
    grid.innerHTML = "";
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  grid.innerHTML = students.map(renderStudentCard).join("");

  grid.querySelectorAll(".coffee-btn, .coffee-link").forEach((btn) => {
    btn.addEventListener("click", () => openCalendly(btn.dataset.student));
  });
}

function clearFilters() {
  document.getElementById("filter-country").value = "";
  document.getElementById("filter-degree").value = "";
  document.getElementById("filter-study").value = "";
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  populateFilters();
  render();

  ["filter-country", "filter-degree", "filter-study"].forEach((id) => {
    document.getElementById(id).addEventListener("change", render);
  });

  document.getElementById("clear-filters").addEventListener("click", clearFilters);
});

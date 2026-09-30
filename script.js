const GRADE_SCALE = [
  { max: 1.24, gradePoint: "1.00-1.24", letter: "A+", remark: "Excellent" },
  { max: 1.49, gradePoint: "1.25-1.49", letter: "A", remark: "Superior" },
  { max: 1.74, gradePoint: "1.50-1.74", letter: "A-", remark: "Very Good" },
  { max: 1.99, gradePoint: "1.75-1.99", letter: "B+", remark: "Good" },
  { max: 2.24, gradePoint: "2.00-2.24", letter: "B", remark: "Very Satisfactory" },
  { max: 2.49, gradePoint: "2.25-2.49", letter: "B-", remark: "High Average" },
  { max: 2.74, gradePoint: "2.50-2.74", letter: "C+", remark: "Average" },
  { max: 2.99, gradePoint: "2.75-2.99", letter: "C", remark: "Fair" },
  { max: 3.99, gradePoint: "3.00-3.99", letter: "C-", remark: "Passing" },
  { max: 4.99, gradePoint: "4.00-4.99", letter: "D", remark: "Conditional - removal exam required" },
  { max: 5.00, gradePoint: "5.00", letter: "F", remark: "Failing" },
];
const results = {};

    function addSubject() {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <input placeholder="Subject">
    <input type="number" min="1" max="5" step="0.01" placeholder="Grade (1.00-5.00)">
    <button class="remove" onclick="this.parentElement.remove()">✕</button>`;
  document.getElementById("subjects").appendChild(row);
}

// Start with 3 empty rows
addSubject();
addSubject();
addSubject();

function calculateAverage(scores) {
  let total = 0;
  for (const score of scores) {
    total = total + score;
  }
  return total / scores.length;
}

function getLetterGrade(average) {
  for (const level of GRADE_SCALE) {
    if (average <= level.max) {
      return level;
    }
  }
}

function calculate() {
  const error = document.getElementById("error");
  error.textContent = "";

  const student = document.getElementById("student").value.trim() || "Unnamed student";
  const rows = document.querySelectorAll("#subjects .row");
  const grades = [];

  // Read and check every row
  for (const row of rows) {
    const inputs = row.querySelectorAll("input");
    const subject = inputs[0].value.trim() || "Subject";
    const value = parseFloat(inputs[1].value);

    if (isNaN(value) || value < 1 || value > 5) {
      error.textContent = "Every final grade must be a number from 1.00 to 5.00.";
      return;
    }
    grades.push({ subject: subject, value: value });
  }

  if (grades.length === 0) {
    error.textContent = "Add at least one subject.";
    return;
  }

  // Calculate
  const scores = grades.map(g => g.value);
  const average = Number(calculateAverage(scores).toFixed(2));
  const level = getLetterGrade(average);
  const passed = average <= 3.99;
  const status = passed ? "PASSED" : average < 5 ? "CONDITIONAL" : "FAILED";
  const statusClass = passed ? "pass" : average < 5 ? "conditional" : "fail";

  let best = grades[0];
  let worst = grades[0];
  for (const g of grades) {
    if (g.value < best.value) best = g;
    if (g.value > worst.value) worst = g;
  }

  // Show the result
  document.getElementById("result").innerHTML = `
    <h2>${student}</h2>
    <div class="big">${average.toFixed(2)} &middot; ${level.letter}</div>
    <p>${level.remark} (${level.gradePoint}) &mdash;
      <span class="${statusClass}">${status}</span></p>
    <p>Strongest: <b>${best.subject}</b> (${best.value.toFixed(2)})</p>
    <p>Needs most work: <b>${worst.subject}</b> (${worst.value.toFixed(2)})</p>`;
  document.getElementById("resultCard").hidden = false;

  results[student] = average;
  showClassSummary();
}

function showClassSummary() {
  const names = Object.keys(results);
  if (names.length < 2) return;

  names.sort((a, b) => results[a] - results[b]);

  let html = "";
  for (const name of names) {
    html += `<li>${name} &mdash; ${results[name].toFixed(2)}</li>`;
  }
  document.getElementById("ranking").innerHTML = html;

  const classAverage = calculateAverage(Object.values(results));
  document.getElementById("classAverage").textContent = "Class average grade point: " + classAverage.toFixed(2);
  document.getElementById("classCard").hidden = false;
}
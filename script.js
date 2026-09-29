const PASSING_GRADE = 70;

    const GRADE_SCALE = [
        { min: 95, letter: "A", remark: "Excellent" },
        { min: 90, letter: "A", remark: "Very Good" },
        { min: 85, letter: "B", remark: "Good" },
        { min: 80, letter: "C", remark: "Wow" },
        { min: 75, letter: "D", remark: "Minimum Passing Mark" },
        { min: 60, letter: "E", remark: "Failed" },
        { min: 0,  letter: "F", remark: "Failed" },
    ];
    const results = {};   // stores each student's average

    function addSubject() {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <input placeholder="Subject">
    <input type="number" min="0" max="100" placeholder="Grade">
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
    if (average >= level.min) {
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

    if (isNaN(value) || value < 0 || value > 100) {
      error.textContent = "Every grade must be a number from 0 to 100.";
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
  const average = calculateAverage(scores);
  const level = getLetterGrade(average);
  const passed = average >= PASSING_GRADE;

  let best = grades[0];
  let worst = grades[0];
  for (const g of grades) {
    if (g.value > best.value) best = g;
    if (g.value < worst.value) worst = g;
  }

  // Show the result
  document.getElementById("result").innerHTML = `
    <h2>${student}</h2>
    <div class="big">${average.toFixed(2)} &middot; ${level.letter}</div>
    <p>${level.remark} &mdash;
      <span class="${passed ? "pass" : "fail"}">${passed ? "PASSED" : "FAILED"}</span></p>
    <p>Strongest: <b>${best.subject}</b> (${best.value})</p>
    <p>Needs most work: <b>${worst.subject}</b> (${worst.value})</p>`;
  document.getElementById("resultCard").hidden = false;

  results[student] = average;
  showClassSummary();
}

function showClassSummary() {
  const names = Object.keys(results);
  if (names.length < 2) return;

  names.sort((a, b) => results[b] - results[a]);

  let html = "";
  for (const name of names) {
    html += `<li>${name} &mdash; ${results[name].toFixed(2)}</li>`;
  }
  document.getElementById("ranking").innerHTML = html;

  const classAverage = calculateAverage(Object.values(results));
  document.getElementById("classAverage").textContent = "Class average: " + classAverage.toFixed(2);
  document.getElementById("classCard").hidden = false;
}
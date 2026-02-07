const quizData = [
  { d:"easy", q:"Which language runs in a web browser?", o:["Java","C","JavaScript"], c:2 },
  { d:"easy", q:"HTML is used for?", o:["Styling","Structure","Logic"], c:1 },
  { d:"easy", q:"CSS is used for?", o:["Logic","Styling","Database"], c:1 },

  { d:"medium", q:"Which year was JavaScript launched?", o:["1994","1995","1996"], c:1 },
  { d:"medium", q:"Which tag is used for JS?", o:["<js>","<script>","<javascript>"], c:1 },
  { d:"medium", q:"DOM stands for?", o:["Data Obj Model","Document Object Model","Digital Object Map"], c:1 },

  { d:"hard", q:"Which company developed JavaScript?", o:["Microsoft","Netscape","Google"], c:1 },
  { d:"hard", q:"Which JS keyword declares constant?", o:["var","let","const"], c:2 },
  { d:"hard", q:"Which is NOT a JS framework?", o:["React","Angular","Django"], c:2 },
  { d:"hard", q:"JS is ___ typed language?", o:["Strong","Weak","No"], c:1 }
];

// Shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

let current = 0;
let score = 0;
let filtered = shuffle([...quizData]);

const qEl = document.getElementById("question");
const opts = document.querySelectorAll("input[name='answer']");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const fill = document.getElementById("progressFill");
const diffSel = document.getElementById("difficultySelect");
const bestScoreEl = document.getElementById("bestScore");

// Load best score
let bestScore = localStorage.getItem("bestScore") || 0;
bestScoreEl.innerText = `Best Score: ${bestScore}`;

function loadQ() {
  opts.forEach(o => o.checked = false);
  const q = filtered[current];

  qEl.innerText = q.q;
  q.o.forEach((text, i) => document.getElementById(`opt${i}`).innerText = text);

  progress.innerText = `Question ${current + 1} of ${filtered.length}`;
  fill.style.width = (current / filtered.length) * 100 + "%";

  nextBtn.innerText = current === filtered.length - 1 ? "Submit" : "Next";
}

nextBtn.onclick = () => {
  let selectedInput = [...opts].find(o => o.checked);
  if (!selectedInput) {
    alert("Select an option");
    return;
  }

  const selectedIndex = Number(selectedInput.value);
  const correctIndex = filtered[current].c;

  const labels = document.querySelectorAll(".options label");

  // Disable further clicks
  opts.forEach(o => o.disabled = true);

  if (selectedIndex === correctIndex) {
    score++;
    labels[selectedIndex].classList.add("correct");
  } else {
    labels[selectedIndex].classList.add("wrong");
    labels[correctIndex].classList.add("correct");
  }

  // Wait for animation, then move ahead
  setTimeout(() => {
    labels.forEach(l => l.classList.remove("correct", "wrong"));
    opts.forEach(o => o.disabled = false);

    current++;

    if (current < filtered.length) {
      loadQ();
    } else {
      let bestScore = localStorage.getItem("bestScore") || 0;
      if (score > bestScore) {
        localStorage.setItem("bestScore", score);
      }

      document.querySelector(".quiz-container").innerHTML = `
        <h2>Quiz Completed 🎉</h2>
        <p>Your Score</p>
        <h1>${score} / ${filtered.length}</h1>
        <button onclick="location.reload()">Restart</button>
      `;
    }
  }, 600);
};

diffSel.onchange = () => {
  filtered = diffSel.value === "all"
    ? shuffle([...quizData])
    : shuffle(quizData.filter(q => q.d === diffSel.value));

  current = 0;
  score = 0;
  loadQ();
};

document.getElementById("toggleTheme").onchange = () =>
  document.body.classList.toggle("dark");

loadQ();
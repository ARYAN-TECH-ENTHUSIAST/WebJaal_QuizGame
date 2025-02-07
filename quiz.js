let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let startTime;
let questionStartTime;

async function loadQuestions(category) {
  const response = await fetch(`https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`);
  const data = await response.json();
  
  questions = data.results.map(q => ({
    question: decodeURIComponent(q.question),
    options: [...q.incorrect_answers, q.correct_answer].map(decodeURIComponent).sort(() => Math.random() - 0.5),
    answer: decodeURIComponent(q.correct_answer)
  }));

  startTime = new Date();
  showQuestion();
}

function showQuestion() {
  if (currentQuestionIndex >= 5) return showResult();

  const q = questions[currentQuestionIndex];
  document.getElementById("question").innerHTML = q.question;
  
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.classList.add("option-button");
    button.onclick = () => checkAnswer(option, q.answer);
    optionsContainer.appendChild(button);
  });

  const hintButton = document.createElement("button");
  hintButton.innerText = "Get Hint 🤔";
  hintButton.classList.add("hint-button");
  hintButton.onclick = () => fetchHint(q.question);
  optionsContainer.appendChild(hintButton);

  const hintDiv = document.getElementById("hint") || document.createElement("div");
  hintDiv.setAttribute("id", "hint");
  hintDiv.style.marginTop = "10px";
  hintDiv.style.fontStyle = "italic";
  optionsContainer.appendChild(hintDiv);

  questionStartTime = new Date();
}

async function fetchHint(question) {
  const hintDiv = document.getElementById("hint");
  hintDiv.innerText = "Generating hint... ⏳";

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "tinyllama",
        prompt: `Give a simple and helpful hint for this quiz question: "${question}"`,
        stream: false,
      }),
    });
    const data = await response.json();
    hintDiv.innerText = `Hint: ${data.response}`;
  } catch (error) {
    hintDiv.innerText = "Hint generation failed! ❌";
    console.error("Error fetching hint:", error);
  }
}

function checkAnswer(selected, correct) {
  const timeTaken = (new Date() - questionStartTime) / 1000;
  if (selected === correct) {
    score++;
    if (timeTaken <= 5) showQuickResponse();
  }

  currentQuestionIndex++;
  showQuestion();
}

function showQuickResponse() {
  const quickResponseMessage = document.createElement("div");
  quickResponseMessage.innerHTML = "<p>Quick Response!</p>";
  quickResponseMessage.style.color = "green";
  document.getElementById("quiz-container").appendChild(quickResponseMessage);
  
  setTimeout(() => quickResponseMessage.remove(), 1000);
}

function showResult() {
  const timeTaken = ((new Date() - startTime) / 1000).toFixed(2);
  document.getElementById("quiz-container").innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your Score: ${score}/5</p>
    <p>Time Taken: ${timeTaken} seconds</p>
  `;
}

function startQuiz() {
  const selectedCategory = document.getElementById("category").value;
  document.getElementById("domain-selection").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  loadQuestions(selectedCategory);
}
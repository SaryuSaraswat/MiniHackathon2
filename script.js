let currentPlayer = 0;
let players = [];
let currentQuestionIndex = 0;
let questions = [];
let playerScores = [0, 0];
let numQuestions = 6;

async function startGame() {
  const player1Name = document.getElementById('player1').value;
  const player2Name = document.getElementById('player2').value;
  const selectedCategory = document.getElementById('category').value;
  numQuestions = parseInt(document.getElementById('numQuestions').value);
  
  if (!player1Name || !player2Name) {
    alert('Please enter names for both players.');
    return;
  }

  players = [player1Name, player2Name];
  playerScores = [0, 0];
  currentPlayer = 0;
  currentQuestionIndex = 0;
  questions = await fetchQuestions(selectedCategory);
  
  document.getElementById('setup').style.display = 'none';
  document.getElementById('questionContainer').style.display = 'block';
  showQuestion();
}

async function fetchCategories() {
  const response = await fetch('https://the-trivia-api.com/api/categories');
  const data = await response.json();
  const categorySelect = document.getElementById('category');

  for (let category in data) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  }
}

async function fetchQuestions(category) {
  const response = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&limit=${numQuestions}`);
  const data = await response.json();
  return data;
}

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    showResults();
    return;
  }

  const question = questions[currentQuestionIndex];
  document.getElementById('questionText').textContent = `${players[currentPlayer]}'s turn: ${question.question}`;
  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = '';
  
  const answers = [question.correctAnswer, ...question.incorrectAnswers].sort(() => Math.random() - 0.5);
  
  answers.forEach(answer => {
    const answerBtn = document.createElement('button');
    answerBtn.textContent = answer;
    answerBtn.onclick = () => checkAnswer(answer, question.correctAnswer);
    answersDiv.appendChild(answerBtn);
  });
}

function checkAnswer(selectedAnswer, correctAnswer) {
  const difficulty = questions[currentQuestionIndex].difficulty;
  let score = 0;

  if (selectedAnswer === correctAnswer) {
    if (difficulty === 'easy') score = 10;
    else if (difficulty === 'medium') score = 15;
    else if (difficulty === 'hard') score = 20;

    playerScores[currentPlayer] += score;
    alert('Correct!');
  } else {
    alert('Incorrect!');
  }
  
  currentQuestionIndex++;
  currentPlayer = currentQuestionIndex % 2;
  showQuestion();
}

function showResults() {
  document.getElementById('questionContainer').style.display = 'none';
  document.getElementById('resultContainer').style.display = 'block';
  
  const resultText = document.getElementById('resultText');
  if (playerScores[0] > playerScores[1]) {
    resultText.textContent = `${players[0]} wins with ${playerScores[0]} points! ${players[1]} scored ${playerScores[1]} points.`;
  } else if (playerScores[1] > playerScores[0]) {
    resultText.textContent = `${players[1]} wins with ${playerScores[1]} points! ${players[0]} scored ${playerScores[0]} points.`;
  } else {
    resultText.textContent = `It's a tie! Both players scored ${playerScores[0]} points.`;
  }
}

function restartGame() {
  document.getElementById('resultContainer').style.display = 'none';
  document.getElementById('setup').style.display = 'block';
  document.getElementById('player1').value = '';
  document.getElementById('player2').value = '';
}

function endGame() {
  document.getElementById('resultContainer').innerHTML = '<h2>Thank you for playing!</h2>';
}

// Fetch categories when the page loads
fetchCategories();
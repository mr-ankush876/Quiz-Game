// Quiz Questions Data (10 questions, mixed single/multi select)
const questions = [
    {
        question: "Which method is used to add a new element to the end of a list in Python?",
        type: "multi",
        options: ["add()", "push()", "append()", "insert()"],
        correctAnswers: [2], // Indices of correct options
        hint: "(Select all that apply)"
    },
    {
        question: "What does HTML stand for?",
        type: "single",
        options: ["Hyper Text Preprocessor", "Hyper Text Markup Language", "Hyper Tool Multi Language", "Hyperlink Text Markup Language"],
        correctAnswers: [1]
    },
    {
        question: "Which Git command is used to send your local code changes to a remote repository like GitHub?",
        type: "multi",
        options: ["git pull", "git fetch", "git commit", "git push"],
        correctAnswers: [3],
        hint: "(Select all that apply)"
    },
    {
        question: "What is the standard port number used for secure HTTP (HTTPS) connections?",
        type: "single",
        options: ["80", "443", "21", "23"],
        correctAnswers: [1]
    },
    {
        question: "Which of the following is an immutable data type in Python?",
        type: "single",
        options: ["list", "dictionary", "string", "set"],
        correctAnswers: [2]
    },
    {
        question: "Which instant real-time payment system was developed by NPCI to boost digital financial inclusion?",
        type: "single",
        options: ["UPI", "BHIM", "PayTM", "Google Pay"],
        correctAnswers: [0]
    },
    {
        question: "How do you add a background color in CSS?",
        type: "single",
        options: ["color: background;", "bg-color: red;", "background-color: #fff;", "background: color #fff;"],
        correctAnswers: [2]
    },
    {
        question: "What is the correct HTML for making a checkbox?",
        type: "single",
        options: ["<checkbox>", "<input type='check'>", "<check>", "<input type='checkbox'>"],
        correctAnswers: [3]
    },
    {
        question: "Which attributes are used for setting the dimensions of an image in HTML?",
        type: "multi",
        options: ["size", "width", "height", "length"],
        correctAnswers: [1, 2],
        hint: "(Select all that apply)"
    },
    {
        question: "What does CSS stand for?",
        type: "single",
        options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"],
        correctAnswers: [0]
    }
];

// App State
let currentQuestionIndex = 0;
let userAnswers = []; // Will store arrays of selected indices
let score = 0;

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    quiz: document.getElementById('quiz-screen'),
    results: document.getElementById('results-screen')
};

const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');

const questionText = document.getElementById('question-text');
const questionHint = document.getElementById('question-hint');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');
const questionCountText = document.getElementById('question-count');
const scoreLiveText = document.getElementById('score-live');

const finalScoreText = document.getElementById('final-score-text');
const scoreCirclePath = document.getElementById('score-circle-path');
const resultsMessage = document.getElementById('results-message');
const statCorrect = document.getElementById('stat-correct');
const statIncorrect = document.getElementById('stat-incorrect');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
submitBtn.addEventListener('click', handleSubmit);
restartBtn.addEventListener('click', resetQuiz);

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    score = 0;
    scoreLiveText.innerText = `Score: 0`;
    showScreen('quiz');
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentQuestionIndex];

    // Update Meta
    questionCountText.innerText = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    progressBar.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;

    // Setup Question
    questionText.innerText = q.question;
    if (q.type === 'multi') {
        questionHint.innerText = q.hint;
        questionHint.style.display = 'block';
    } else {
        questionHint.style.display = 'none';
    }

    // Render Options
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.dataset.index = index;

        optionDiv.innerHTML = `
            <div class="option-checkbox" style="border-radius: ${q.type === 'multi' ? '4px' : '50%'}"></div>
            <span>${opt}</span>
        `;

        optionDiv.addEventListener('click', () => toggleOption(index));
        optionsContainer.appendChild(optionDiv);
    });

    // Reset Submit Button
    submitBtn.innerText = 'Submit Answer';
    submitBtn.disabled = true;
    submitBtn.dataset.state = 'submit'; // 'submit' or 'next'
}

function toggleOption(index) {
    if (submitBtn.dataset.state === 'next') return; // Locked after submitting

    const q = questions[currentQuestionIndex];
    const optionDiv = optionsContainer.children[index];

    if (q.type === 'single') {
        // Deselect others
        Array.from(optionsContainer.children).forEach(child => child.classList.remove('selected'));
        optionDiv.classList.add('selected');
    } else {
        // Toggle this one
        optionDiv.classList.toggle('selected');
    }

    // Enable submit if at least one selected
    const hasSelection = Array.from(optionsContainer.children).some(child => child.classList.contains('selected'));
    submitBtn.disabled = !hasSelection;
}

function handleSubmit() {
    if (submitBtn.dataset.state === 'next') {
        // Move to next question or finish
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
        return;
    }

    // Process Submission
    const q = questions[currentQuestionIndex];
    const selectedIndices = Array.from(optionsContainer.children)
        .filter(child => child.classList.contains('selected'))
        .map(child => parseInt(child.dataset.index));

    // Check correctness
    let isCorrect = false;
    if (q.type === 'single') {
        isCorrect = selectedIndices.length === 1 && selectedIndices[0] === q.correctAnswers[0];
    } else {
        isCorrect = selectedIndices.length === q.correctAnswers.length &&
            selectedIndices.every(val => q.correctAnswers.includes(val));
    }

    if (isCorrect) {
        score++;
        scoreLiveText.innerText = `Score: ${score}`;
    }

    // Reveal Answers visually
    Array.from(optionsContainer.children).forEach((child, index) => {
        child.classList.remove('selected');
        if (q.correctAnswers.includes(index)) {
            child.classList.add('correct');
        } else if (selectedIndices.includes(index) && !q.correctAnswers.includes(index)) {
            child.classList.add('wrong');
        }
    });

    // Update Button State
    submitBtn.dataset.state = 'next';
    submitBtn.innerText = currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question';
}

function showResults() {
    progressBar.style.width = '100%';
    setTimeout(() => {
        showScreen('results');

        // Calculate percentages
        const percentage = Math.round((score / questions.length) * 100);

        // Animate Circle
        // Calculate stroke dasharray based on percentage. 
        // 100 is max. 
        scoreCirclePath.setAttribute('stroke-dasharray', `${percentage}, 100`);

        // Set Stroke Color based on score
        let strokeColor = 'var(--success)';
        if (percentage < 40) strokeColor = 'var(--danger)';
        else if (percentage < 70) strokeColor = '#f59e0b'; // warning/orange

        scoreCirclePath.style.stroke = strokeColor;

        // Counter Animation
        let currentPercent = 0;
        finalScoreText.innerText = '0%';
        const interval = setInterval(() => {
            currentPercent++;
            finalScoreText.innerText = `${currentPercent}%`;
            if (currentPercent >= percentage) {
                clearInterval(interval);
            }
        }, 15);

        // Update Text
        statCorrect.innerText = score;
        statIncorrect.innerText = questions.length - score;

        if (percentage >= 80) {
            resultsMessage.innerText = "Excellent Job! You're a pro.";
        } else if (percentage >= 50) {
            resultsMessage.innerText = "Good effort! Keep practicing.";
        } else {
            resultsMessage.innerText = "You might need to study more.";
        }
    }, 500);
}

function resetQuiz() {
    startQuiz();
}

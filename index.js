
const questionElement = document.querySelector('.display-question');
const nextButton = document.querySelector('#next-question');
const buttonContainer = document.querySelector('.display-answer');
let currentQuestionIndex = 0;
let correctScore = 0;
let completedScore = 0;

async function init() {
    // get the question
    const res = await fetch("https://the-trivia-api.com/v2/questions?tags=ancient_greece&limit=10");
    const data = await res.json();
    const questions = data.map(item => ({
        text: item.question.text,
        correctAnswer: item.correctAnswer,
        incorrectAnswers: item.incorrectAnswers
    }));

    // display the first question and options
    displayQuestion(questions[currentQuestionIndex]);

        // add event listener to the next button
    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion(questions[currentQuestionIndex]);
        } else {
            displayNoMoreQuestions();
        }
    })

    // Find the button with the correct answer and change its color
    function showCorrectAnswer() {
        const correctButton = Array.from(buttonContainer.children).find(button =>
            button.textContent === questions[currentQuestionIndex].correctAnswer
        );
        if (correctButton) {
            correctButton.classList.add('bg-green-500');
        }
    }

    // display the question
    function displayQuestion(question) {
        // Clear the previous answers
        buttonContainer.innerHTML = '';
        // Display the question
        questionElement.textContent = question.text;
        // Combine the correct and incorrect answers
        const allAnswers = [question.correctAnswer, ...question.incorrectAnswers];
        // Shuffle the answers
        for (let i = allAnswers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
        }
        // Display the answers
        allAnswers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.className = 'bg-cyan-800 hover:bg-pink-400 cursor-pointer py-3 px-6 rounded-none';
            button.addEventListener('click', () => {
                if (button.textContent === question.correctAnswer) {
                    button.classList.add('bg-green-500');
                    correctScore++;
                } else {
                    button.classList.add('bg-red-500');
                    showCorrectAnswer();
                }
                completedScore++;
                updatedScoreDisplay();
                // Disable all buttons after user selects an option
                document.querySelectorAll('.display-answer button').forEach(btn => {
                    btn.disabled = true;
                });
            });
            buttonContainer.appendChild(button);
        });

    }

    
    
}

function updatedScoreDisplay() {
    document.querySelector('#correct').textContent = correctScore;
    document.querySelector('#completed').textContent = completedScore;
}

function displayNoMoreQuestions() {
    nextButton.textContent = 'No more questions!';
}


init();




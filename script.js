// Dados do Jogo
const questions = {
    Adição: generateQuestions('+', 50, 1, 10),
    'Adição - Avançada': generateQuestions('+', 50, 10, 99),
    Subtração: generateQuestions('-', 50, 1, 10),
    'Subtração - Avançada': generateQuestions('-', 50, 10, 99, true),
    Multiplicação: generateQuestions('*', 50, 1, 10),
    'Multiplicação - Avançada': generateQuestions('*', 50, 10, 99, false, 1, 9),
    Divisão: generateQuestions('/', 50, 1, 10),
    Geografia: generateGeographyQuestions(40)
};

// Define as fases do jogo
const phases = [
    'Adição',
    'Adição - Avançada',
    'Subtração',
    'Subtração - Avançada',
    'Multiplicação',
    'Multiplicação - Avançada',
    'Divisão',
    'Geografia'
];

// Define as imagens de background para cada fase
const phaseBackgrounds = [
    "./imagens/foto_dragao.jpg",
    "./imagens/dois_dragoes_jogando_fogo.jfif",
    "./imagens/dragao_atack_cavaleiro.jpg",
    "./imagens/dragao_grande_x_pequeno.jfif",
    "./imagens/dragao_mordendo_pescoço.png",
    "./imagens/dragao_muito_grande.jpg",
    "./imagens/dragao_muito_grande.jpg",
    "./imagens/dragao_vencedor.jfif"
];

// Variáveis globais
let currentPhaseIndex = 0;
let currentQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let playerName = '';
let totalScore = 0;
let ranking = [];

// Referências do DOM
const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');
const gameSection = document.getElementById('game-section');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextQuestionButton = document.getElementById('next-question');
const feedbackElement = document.createElement('div');
feedbackElement.id = 'feedback';
optionsElement.parentElement.appendChild(feedbackElement);
const resultSection = document.getElementById('result-section');
const resultMessage = document.getElementById('result-message');
const restartGameButton = document.getElementById('restart-game');
const rankingList = document.getElementById('ranking-list');
const phaseTitle = document.getElementById('phase-title');

// Eventos de clique
startGameButton.addEventListener('click', startGame);
nextQuestionButton.addEventListener('click', showNextQuestion);
restartGameButton.addEventListener('click', restartGame);

// Função para iniciar o jogo
function startGame() {
    playerName = playerNameInput.value;
    if (playerName.trim() === '') {
        alert('Por favor, insira seu nome.');
        return;
    }

    document.querySelector('h1').classList.add('hidden');
    document.querySelector('h2').classList.add('hidden');

    currentPhaseIndex = 0;
    totalScore = 0; // Reseta a pontuação total ao iniciar o jogo
    correctAnswers = 0;
    currentQuestions = [];
    currentQuestionIndex = 0;

    loadPhase();
    playerNameInput.parentElement.classList.add('hidden');
    gameSection.classList.remove('hidden');
}

// Função para carregar a fase atual
function loadPhase() {
    currentQuestions = shuffleArray(questions[phases[currentPhaseIndex]]);
    phaseTitle.innerText = `Fase: ${phases[currentPhaseIndex]}`;
    document.body.style.backgroundImage = `url(${phaseBackgrounds[currentPhaseIndex]})`;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    feedbackElement.innerHTML = '';
    showNextQuestion();
}

// Função para exibir a próxima pergunta
function showNextQuestion() {
    feedbackElement.innerHTML = '';

    if (currentQuestionIndex >= currentQuestions.length || currentQuestionIndex >= 10) {
        endPhase();
        return;
    }

    const questionData = currentQuestions[currentQuestionIndex];
    questionElement.innerText = questionData.question;
    optionsElement.innerHTML = '';

    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.disabled = false;
        button.addEventListener('click', () => {
            checkAnswer(index, questionData.correctAnswerIndex);
            disableOptions(); // Impede de selecionar outra opção após responder
        });
        optionsElement.appendChild(button);
    });

    nextQuestionButton.classList.add('hidden');
}

// Função para desabilitar opções após responder
function disableOptions() {
    const buttons = optionsElement.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

// Função para verificar a resposta escolhida
function checkAnswer(selectedIndex, correctIndex) {
    const isCorrect = selectedIndex === correctIndex;
    if (isCorrect) {
        correctAnswers++;
        feedbackElement.innerHTML = '<p style="color: green;">Resposta certa! Ótimo golpe, guerreiro!!!</p>';
    } else {
        feedbackElement.innerHTML = '<p style="color: red;">Resposta errada. Golpe errado, guerreiro!!!</p>';
    }

    currentQuestionIndex++;
    nextQuestionButton.classList.remove('hidden');
}

// Função para terminar a fase atual
function endPhase() {
    let message = '';
    if (correctAnswers < 6) {
        message = 'Não foi desta vez, tente novamente.';
    } else if (correctAnswers === 7) {
        message = 'Parabéns, voce é Nub!';
    } else if (correctAnswers === 8) {
        message = 'Parabéns, você é Pró!';
    } else if (correctAnswers === 9) {
        message = 'Parabéns, você é Hacker!';
    } else if (correctAnswers === 10) {
        message = 'Parabéns, você é o Melhor!';
    }

    // Calcula a pontuação com base na fase
    let phaseScore = 0;
    if (['Adição', 'Subtração', 'Multiplicação'].includes(phases[currentPhaseIndex])) {
        phaseScore = correctAnswers; // 1 ponto por resposta certa
    } else if (['Geografia'].includes(phases[currentPhaseIndex])) {
        phaseScore = correctAnswers * 3;
    }
    else {
        phaseScore = correctAnswers * 2; // 2 pontos por resposta certa nas outras fases
    }
    totalScore += phaseScore; // Atualiza a pontuação total

    feedbackElement.innerHTML = `<p style="color: blue;">${message}</p>`;

    // Se o jogador acertar pelo menos 6 perguntas e não for a última fase
    if (correctAnswers >= 6 && currentPhaseIndex < phases.length - 1) {
        setTimeout(() => {
            feedbackElement.innerHTML = '<p style="color: blue;">PRONTO PARA O PRÓXIMO DESAFIO!</p>'; 
            currentPhaseIndex++; 
            setTimeout(loadPhase, 2000);
        }, 2000); 
    } else if (currentPhaseIndex === phases.length - 1) {
        feedbackElement.innerHTML = '<p style="color: green;">Você superou todos os níveis e é o melhor guerreiro!</p>';
        setTimeout(() => {
            resultMessage.innerText = 'Você superou todos os níveis e é o melhor guerreiro!'; 
            gameSection.classList.add('hidden'); 
            resultSection.classList.remove('hidden'); 
            updateRanking(); 
        }, 2000);
    } else {
        setTimeout(() => {
            resultMessage.innerText = message; 
            gameSection.classList.add('hidden'); 
            resultSection.classList.remove('hidden'); 
            updateRanking(); 
        }, 2000);
    }
}

// Função para atualizar o ranking
function updateRanking() {
    ranking.push({ name: playerName, score: totalScore });
    ranking.sort((a, b) => b.score - a.score);

    rankingList.innerHTML = '';
    ranking.slice(0, 10).forEach((player, index) => {
        const li = document.createElement('li');
        li.innerText = `${index + 1}º. ${player.name} - ${player.score} pontos`;
        rankingList.appendChild(li);
    });
}

// Função para reiniciar o jogo
function restartGame() {
    resultSection.classList.add('hidden');
    playerNameInput.parentElement.classList.remove('hidden');
    document.querySelector('h1').classList.remove('hidden');
    document.querySelector('h2').classList.remove('hidden');
}

// Função para gerar questões de matemática
function generateQuestions(operation, numQuestions, minRange = 1, maxRange = 10, positiveResult = false, minSecond = 1, maxSecond = 10) {
    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
        const a = getRandomInt(minRange, maxRange);
        const b = getRandomInt(minSecond, maxSecond);
        let correctAnswer;
        let operationSymbol = operation;

        switch (operation) {
            case '+':
                correctAnswer = a + b;
                break;
            case '-':
                correctAnswer = positiveResult ? Math.abs(a - b) : a - b;
                break;
            case '*':
                correctAnswer = a * b;
                operationSymbol = 'x';
                break;
            case '/':
                correctAnswer = Math.floor(a / b);
                operationSymbol = '÷';
                break;
        }

        const options = generateOptions(correctAnswer);
        questions.push({
            question: `Quanto é ${a} ${operationSymbol} ${b}?`,
            options: options,
            correctAnswerIndex: options.indexOf(correctAnswer)
        });
    }
    return questions;
}

// Função para gerar perguntas de geografia
function generateGeographyQuestions(numQuestions) {
    // Perguntas de exemplo (podem ser personalizadas)
    const questions = [
        {
            question: 'Qual é a capital do Brasil?',
            options: ['Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'],
            correctAnswerIndex: 0
        },
        {
            question: 'Qual é o maior país da América do Sul?',
            options: ['Brasil', 'Argentina', 'Peru', 'Colômbia'],
            correctAnswerIndex: 0
        },
        {
            question: 'Qual é a capital de Minas Gerais?',
            options: ['Contagem', 'São João Del Rey', 'Belo Horizonte', 'Lavras'],
            correctAnswerIndex: 2
        },
        {
            question: 'Onde mora o presidente do Brasil?',
            options: ['Belo Horizonte', 'Rio de Janeiro', 'São Paulo', 'Brasília'],
            correctAnswerIndex: 3
        },
        {
            question: 'Em qual Estado fica a cidade de Conceição da Barra de Minas?',
            options: ['São Paulo', 'Minas Gerais', 'Brasília','Belo Horizonte'],
            correctAnswerIndex: 1
        },
        
        {
            question: 'Em qual Região fica o Estado do Rio Grande do Sul?',
            options: ['Região Norte',  'Região Sul', 'Região Leste','Região Oeste'],
            correctAnswerIndex: 1
        },
        {
            question: 'O Amazonas é?',
            options: ['Uma Floresta',  'Um País', 'Uma Montanha','Um Estado'],
            correctAnswerIndex: 3
        },
        {
            question: 'Qual dese Estado não é banhado pelo Mar?',
            options: ['Minas Gerais', 'Espirito Santo','Goiás', 'Piaí'],
            correctAnswerIndex: 0
        },
        {
            question: 'O que é uma Floresta?',
            options: ['Um conjunto de Montanhas', 'Uma plantação de Alimentos', 'Um amontoado de terra rodeado por Agua','Uma região repleta de Arvores'],
            correctAnswerIndex: 3
        },
        {
            question: 'O que é Agricultura?',
            options: ['Uma Profição', 'Prática de Cultivar a Terra', 'Um homem que vive em Fazenda', 'Uma plantação de Arroz'],
            correctAnswerIndex: 1
        },
        {
            question: 'Qual a planta que fornece o Alcool?',
            options: ['A Macieira', 'A Cana de Alcool','A Cana de Açucar', 'O Trigo'],
            correctAnswerIndex: 2
        },
        
        // Adicione mais perguntas de geografia conforme necessário
    ];

    return shuffleArray(questions).slice(0, numQuestions); // Retorna um número de perguntas embaralhadas
}

// Função para embaralhar um array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para gerar opções de respostas
function generateOptions(correctAnswer) {
    const options = new Set();
    options.add(correctAnswer);

    while (options.size < 4) {
        const randomOption = correctAnswer + getRandomInt(-10, 10);
        options.add(randomOption);
    }

    return shuffleArray(Array.from(options));
}

// Função para obter um inteiro aleatório
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

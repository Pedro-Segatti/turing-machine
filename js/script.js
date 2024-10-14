// Adiciona a ação no botão de enter
document.getElementById('sentences').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('analyze-button').click();
    }
});

let currentState = 'q0';
let steps = 0;
let index = 0;

// Apenas valida para não deixar digitar outras letras e números a não ser a e b
function validateInput() {
    const sentenceInput = document.getElementById('sentences');
    const validChars = /^[ab]*$/;

    if (!validChars.test(sentenceInput.value)) {
        sentenceInput.value = sentenceInput.value.replace(/[^ab]/g, '');
    }
}

// Invocada ao clicar em analisar
function onClickAnalyseButton() {
    const sentenceInput = document.getElementById('sentences').value;
    if (!sentenceInput) {
        return;
    }

    const tapeArray = ['•', ...sentenceInput, 'β'];

    currentState = 'q0'; // inicia sempre em q0
    index = 0;
    steps = 0;

    clearStepsTable(); // limpa a tabela de passos
    clearResultMessage(); // limpa a mensagem de resultado
    createTape(tapeArray); // cria a tabela da fita
    analyzeSentence(tapeArray); // analisa a sentença em si
}

// Cria a tabela de controle de fita
function createTape() {
    const tapeContainer = document.getElementById('tape-container');
    tapeContainer.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'highlight centered';
    table.id = 'tape-table';

    tapeContainer.appendChild(table);
}

// Adiciona a linha que corresponde ao estado da fita
function addRowOnTape(tapeArray, index) {
    const tableBody = document.getElementById("tape-table");
    const newRow = document.createElement("tr");

    tapeArray.forEach((symbol, idx) => {
        const cell = document.createElement("td");
        cell.id = `tape-cell-${idx}`;
        cell.innerText = symbol;
        cell.classList.add("tape-cell");
        if (idx === index) {
            cell.style.backgroundColor = "rgb(87, 166, 161)"; // destaca a localização do cabeçote da fita
        }
        newRow.appendChild(cell);
    });

    tableBody.appendChild(newRow);
}

// Marca o estado que está sendo lido da tabela, destacando em verde
function highlightStepStateOnTable(tapeArray) {
    const tableCells = document.querySelectorAll("td");
    tableCells.forEach(cell => {
        if (cell.style.backgroundColor === "rgb(87, 166, 161)") {
            cell.style.backgroundColor = "";
        }
    });

    let rowIndex;
    switch (currentState) {
        case 'q0':
            rowIndex = 0;
            break;
        case 'q1':
            rowIndex = 1;
            break;
        case 'q2':
            rowIndex = 2;
            break;
        case 'q3':
            rowIndex = 3;
            break;
        case 'q4':
            rowIndex = 4;
            break;
        default:
            return;
    }

    let columnIndex;
    switch (tapeArray[index]) {
        case '•':
            columnIndex = 1;
            break;
        case 'a':
            columnIndex = 2;
            break;
        case 'b':
            columnIndex = 3;
            break;
        case 'X':
            columnIndex = 4;
            break;
        case 'β':
            columnIndex = 5;
            break;
        default:
            return;
    }

    const cell = document.getElementById(`${rowIndex}_${columnIndex}`);
    if (cell) {
        cell.style.backgroundColor = "rgb(87, 166, 161)";
    }
}

// Adiciona a linha do passo em que estamos, simula o que fizemos no caderno
function addRowOnStepTable(step, currentState, readSymbol, nextState, writtenSymbol, direction) {
    const stepsTableBody = document.getElementById("steps-table-body");

    const row = document.createElement("tr");
    const cell = document.createElement("td");

    const stepText = `${step || '-'}: ${currentState || '-'}, ${readSymbol || '-'} -> ${nextState || '-'}, ${writtenSymbol || '-'}, ${direction || '-'}`;
    cell.textContent = stepText;

    row.appendChild(cell);
    stepsTableBody.appendChild(row);

    row.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Limpa a tabela de passos
function clearStepsTable() {
    const stepsTableBody = document.getElementById("steps-table-body");

    while (stepsTableBody.firstChild) {
        stepsTableBody.removeChild(stepsTableBody.firstChild); // Remove cada linha uma a uma
    }
}

// Mostra o resultado do processamento da sentença
function displayResultMessage(isAccepted, steps) {
    const resultMessage = document.getElementById("result-message");

    resultMessage.textContent = "";

    const message = isAccepted
        ? `Sentença aceita em ${steps} passos`
        : `Sentença rejeitada em ${steps} passos`;

    resultMessage.style.color = isAccepted ? "green" : "red";
    resultMessage.textContent = message;
    resultMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Limpa o resultado do processamento
function clearResultMessage() {
    const resultMessage = document.getElementById("result-message");

    resultMessage.textContent = "";
}

// Analisa as sentenças de fato
async function analyzeSentence(tapeArray) {
    let backState;
    while (currentState !== 'q4' && currentState !== null) {
        let currentSymbol = tapeArray[index];
        let nextState, writtenSymbol, direction;

        switch (currentState) {
            case 'q0':
                if (currentSymbol === 'a') {
                    [nextState, writtenSymbol, direction] = ['q2', 'X', 'D'];
                } else if (currentSymbol === 'b') {
                    [nextState, writtenSymbol, direction] = ['q1', 'X', 'D'];
                } else if (currentSymbol === 'X') {
                    [nextState, writtenSymbol, direction] = ['q0', 'X', 'D'];
                } else if (currentSymbol === 'β') {
                    [nextState, writtenSymbol, direction] = ['q4', 'β', 'D'];
                } else {
                    [nextState, writtenSymbol, direction] = ['q0', currentSymbol, 'D'];
                }
                break;
            case 'q1':
                if (currentSymbol === 'a') {
                    [nextState, writtenSymbol, direction] = ['q3', 'X', 'E'];
                } else if (currentSymbol === 'b') {
                    [nextState, writtenSymbol, direction] = ['q1', 'b', 'D'];
                } else if (currentSymbol === 'X') {
                    [nextState, writtenSymbol, direction] = ['q1', 'X', 'D'];
                } else {
                    nextState = null;
                }
                break;
            case 'q2':
                if (currentSymbol === 'a') {
                    [nextState, writtenSymbol, direction] = ['q2', 'a', 'D'];
                } else if (currentSymbol === 'b') {
                    [nextState, writtenSymbol, direction] = ['q3', 'X', 'E'];
                } else if (currentSymbol === 'X') {
                    [nextState, writtenSymbol, direction] = ['q2', 'X', 'D'];
                } else {
                    nextState = null; // Invalid sentence
                }
                break;
            case 'q3':
                if (currentSymbol === 'a') {
                    [nextState, writtenSymbol, direction] = ['q3', 'a', 'E'];
                } else if (currentSymbol === 'b') {
                    [nextState, writtenSymbol, direction] = ['q3', 'b', 'E'];
                } else if (currentSymbol === 'X') {
                    [nextState, writtenSymbol, direction] = ['q0', 'X', 'D'];
                } else {
                    nextState = null;
                }
                break;
            default:
                nextState = null;
        }

        if (writtenSymbol) {
            tapeArray[index] = writtenSymbol;
        }

        if (direction) {
            index += (direction === 'D') ? 1 : -1;
        }
        steps++;

        backState = currentState;
        currentState = nextState;
        highlightStepStateOnTable(tapeArray);
        addRowOnTape(tapeArray, index);
        addRowOnStepTable(steps, currentState ? currentState : backState, currentSymbol, nextState, writtenSymbol, direction);


        if (currentState === 'q4') {
            displayResultMessage(true, steps);
            return;
        }

        if (currentState === null) {
            displayResultMessage(false, steps);
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // delay de 1s para a visualização passo a passo
    }
}
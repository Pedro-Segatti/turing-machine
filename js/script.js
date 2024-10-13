// Estado inicial da máquina de Turing
let estadoAtual = 'q0';
let passos = 0;
let index = 0;

// Função que será chamada ao clicar em "Analisar"
function addSentence() {
    const sentenceInput = document.getElementById('sentences').value;
    const sentenceArray = [...sentenceInput, 'β']; // Adicionando 'β' ao final da sentença
    estadoAtual = 'q0';  // Iniciando do estado q0
    index = 0;
    passos = 0;

    criarFita(sentenceArray); // Cria a visualização da fita
    analisarSentenca(sentenceArray); // Inicia a simulação
}

// Função para criar a tabela da fita
function criarFita(sentenceArray) {
    const fitaContainer = document.getElementById('fita-container');
    fitaContainer.innerHTML = ''; // Limpa o container da fita

    const table = document.createElement('table');
    table.className = 'highlight centered';

    const row = document.createElement('tr');

    sentenceArray.forEach((simbolo, idx) => {
        const cell = document.createElement('td');
        cell.innerText = simbolo;
        cell.id = `fita-cell-${idx}`;
        row.appendChild(cell);
    });

    table.appendChild(row);
    fitaContainer.appendChild(table);
}

// Função para atualizar a célula da fita e destacar o cabeçote
function atualizarFita(sentenceArray) {
    sentenceArray.forEach((simbolo, idx) => {
        const cell = document.getElementById(`fita-cell-${idx}`);
        if (cell) {
            cell.innerText = simbolo;
            cell.classList.remove('highlight-head'); // Remove o destaque de todas as células
        }
    });

    // Destaca a célula onde o cabeçote está posicionado
    const currentCell = document.getElementById(`fita-cell-${index}`);
    if (currentCell) {
        currentCell.classList.add('highlight-head'); // Adiciona destaque ao cabeçote
    }
}

// Função principal que simula a máquina de Turing com delay
async function analisarSentenca(sentenceArray) {
    while (estadoAtual !== 'q4' && estadoAtual !== null) {
        let simboloAtual = sentenceArray[index];
        let proximoEstado, simboloEscrito, direcao, coluna;

        switch (estadoAtual) {
            case 'q0':
                if (simboloAtual === 'a') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q2', 'X', 'D', 2];
                } else if (simboloAtual === 'b') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q1', 'X', 'D', 3];
                } else if (simboloAtual === 'X') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q0', 'X', 'D', 4];
                } else if (simboloAtual === 'β') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q4', 'β', 'D', 5];
                } else {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q0', simboloAtual, 'D', 1];
                }
                break;
            case 'q1':
                if (simboloAtual === 'a') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q3', 'X', 'E', 2];
                } else if (simboloAtual === 'b') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q1', 'b', 'D', 3];
                } else if (simboloAtual === 'X') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q1', 'X', 'D', 4];
                } else {
                    proximoEstado = null; // Sentença inválida
                }
                break;
            case 'q2':
                if (simboloAtual === 'a') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q2', 'a', 'D', 2];
                } else if (simboloAtual === 'b') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q3', 'X', 'E', 3];
                } else if (simboloAtual === 'X') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q2', 'X', 'D', 4];
                } else {
                    proximoEstado = null; // Sentença inválida
                }
                break;
            case 'q3':
                if (simboloAtual === 'a') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q3', 'a', 'E', 2];
                } else if (simboloAtual === 'b') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q3', 'b', 'E', 3];
                } else if (simboloAtual === 'X') {
                    [proximoEstado, simboloEscrito, direcao, coluna] = ['q0', 'X', 'D', 4];
                } else {
                    proximoEstado = null; // Sentença inválida
                }
                break;
            default:
                proximoEstado = null;
        }

        sentenceArray[index] = simboloEscrito;
        atualizarFita(sentenceArray);

        if (direcao === 'D') index++;
        else if (direcao === 'E') index--;

        estadoAtual = proximoEstado;
        passos++;

        if (estadoAtual === 'q4') {
            alert(`Sentença aceita! Passos: ${passos}`);
            return;
        }

        if (estadoAtual === null) {
            alert(`Sentença rejeitada. Passos: ${passos}`);
            return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adiciona delay de 1 segundo
    }
}

import { CanvasRenderer, Color, Rect, Vector2 } from "../lib/index.js";

function pegar_celula(cells, x, y) {
    if (cells[x] === undefined) {
        return undefined;
    }
    return cells[x][y];
}

function add_vizinhos(cells, celula, fronteira) {
    let x = celula.x;
    let y = celula.y;

    let cima = pegar_celula(cells, x, y - 1);
    let baixo = pegar_celula(cells, x, y + 1);
    let esquerda = pegar_celula(cells, x - 1, y);
    let direita = pegar_celula(cells, x + 1, y);

    if (cima !== undefined && cima.visitado == false) {
        fronteira.push({ origem: celula, vizinho: cima, direcao: 0 });
    }

    if (baixo !== undefined && baixo.visitado == false) {
        fronteira.push({ origem: celula, vizinho: baixo, direcao: 1 });
    }

    if (esquerda !== undefined && esquerda.visitado == false) {
        fronteira.push({ origem: celula, vizinho: esquerda, direcao: 2 });
    }

    if (direita !== undefined && direita.visitado == false) {
        fronteira.push({ origem: celula, vizinho: direita, direcao: 3 });
    }
}

function oposta(direcao) {
    if (direcao === 0) {
        return 1;
    }
    if (direcao === 1) {
        return 0;
    }
    if (direcao === 2) {
        return 3;
    }
    return 2;
}

function abrir(origem, vizinho, direcao) {
    origem.walls[direcao].aberta = true;
    vizinho.walls[oposta(direcao)].aberta = true;
}

function algoritmo(cells) {
    let x = Math.trunc(Math.random() * cells.length);
    let y = Math.trunc(Math.random() * cells[x].length);
    let celula_inicial = cells[x][y];
    celula_inicial.visitado = true;

    let fronteira = [];
    add_vizinhos(cells, celula_inicial, fronteira);

    while (fronteira.length > 0) {
        let roleta = Math.trunc(Math.random() * fronteira.length);
        let escolhido = fronteira[roleta];
        fronteira.splice(roleta, 1);

        if (escolhido.vizinho.visitado === false) {
            abrir(escolhido.origem, escolhido.vizinho, escolhido.direcao);
            escolhido.vizinho.visitado = true;
            add_vizinhos(cells, escolhido.vizinho, fronteira);
        }
    }
}

function update() {
    const canvas = document.querySelector("canvas");
    const renderer = new CanvasRenderer(canvas);
    renderer.setSize(window.innerWidth / 2, window.innerHeight);

    const columns = Number(document.querySelector("input[name='largura']").value);
    const rows = Number(document.querySelector("input[name='altura']").value);

    const cellSize = Math.min(renderer.width / columns, renderer.height / rows);
    renderer.fillRect(new Rect(0, 0, columns * cellSize, rows * cellSize), Color.white());

    const cells = Array.from({ length: columns }, () => Array.from({ length: rows }));

    const getWalls = (rectangle) => {
        const topLeftVec = new Vector2(rectangle.left, rectangle.top);
        const bottomLeftVec = new Vector2(rectangle.left, rectangle.bottom);
        const topRightVec = new Vector2(rectangle.right, rectangle.top);
        const bottomRightVec = new Vector2(rectangle.right, rectangle.bottom);

        const topWall = { start: topLeftVec, end: topRightVec, aberta: false };
        const bottomWall = { start: bottomLeftVec, end: bottomRightVec, aberta: false };
        const leftWall = { start: topLeftVec, end: bottomLeftVec, aberta: false };
        const rightWall = { start: topRightVec, end: bottomRightVec, aberta: false };

        return [topWall, bottomWall, leftWall, rightWall];
    };

    const drawWall = (wall, color, width) => {
        if (wall.aberta) return;
        renderer.drawLine(wall.start, wall.end, color, width);
    };

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            const gap = cellSize * 0.1;
            const rectangle = new Rect(i * cellSize + gap / 2, j * cellSize + gap / 2, cellSize - gap, cellSize - gap);
            const walls = getWalls(rectangle);
            const line = cells[i];
            if (line)
                line[j] = {
                    rectangle,
                    walls,
                    x: i,
                    y: j,
                    visitado: false
                };
        }
    }

    algoritmo(cells);

    for (const column of cells) {
        for (const row of column) {
            for (const wall of row.walls) {
                drawWall(wall, Color.black(), cellSize * 0.1);
            }
        }
    }
}

document.querySelector("#submit").addEventListener("click", update);

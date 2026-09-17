import { CanvasRenderer, Color, Rect, Vector2 } from "../lib/index.js";

function update() {
    const canvas = document.querySelector("canvas");
    const renderer = new CanvasRenderer(canvas);
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    let columns = document.querySelector("input[name='largura']").value;
    let rows = document.querySelector("input[name='altura']").value;
    const cellSize = Math.min(renderer.width / columns, renderer.height / rows);
    renderer.fillRect(new Rect(0, 0, columns * cellSize, rows * cellSize), Color.white());
    const cells = Array.from({ length: columns }, () => Array.from({ length: rows }));
    const randomCell = () => {
        const line = cells[Math.trunc(Math.random() * columns)];
        if (!line)
            throw new Error("Invalid address, something went very wrong (Row)");
        const column = line[Math.trunc(Math.random() * rows)];
        if (!column)
            throw new Error("Invalid address, something went very wrong (Column)");
        return column;
    };
    const getWalls = (rectangle) => {
        const topLeftVec = new Vector2(rectangle.left, rectangle.top);
        const bottomLeftVec = new Vector2(rectangle.left, rectangle.bottom);
        const topRightVec = new Vector2(rectangle.right, rectangle.top);
        const bottomRightVec = new Vector2(rectangle.right, rectangle.bottom);
        const topWall = { start: topLeftVec, end: topRightVec };
        const bottomWall = { start: bottomLeftVec, end: bottomRightVec };
        const leftWall = { start: topLeftVec, end: bottomLeftVec };
        const rightWall = { start: topRightVec, end: bottomRightVec };
        return [topWall, bottomWall, leftWall, rightWall];
    };
    const drawWall = (wall, color, width) => {
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
                };
        }
    }
    for (const column of cells) {
        for (const row of column) {
            for (const wall of row.walls) {
                drawWall(wall, Color.black(), cellSize * 0.1);
            }
        }
    }
}

document.querySelector("#submit").addEventListener("click",update);
console.log(randomCell());

import { CanvasRenderer, Color, Rect } from "../lib/index.js";
const canvas = document.querySelector("canvas");
const renderer = new CanvasRenderer(canvas);
renderer.setSize(window.innerWidth / 2, window.innerHeight);
const columns = 21;
const rows = 21;
const cellSize = Math.min(renderer.width / columns, renderer.height / rows);
renderer.fillRect(new Rect(0, 0, columns * cellSize, rows * cellSize), Color.black());
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
for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
        const gap = cellSize * 0.1;
        const cell = new Rect(i * cellSize + gap / 2, j * cellSize + gap / 2, cellSize - gap, cellSize - gap);
        const line = cells[i];
        if (line)
            line[j] = cell;
        renderer.fillRect(cell, Color.white());
    }
}
console.log(randomCell());

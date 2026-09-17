import { CanvasRenderer, Color, Rect, Vector2 } from "../lib/index.js";

interface Line {
	start: Vector2;
	end: Vector2;
}
interface Cell {
	rectangle: Rect;
	walls: Array<Line>;
}
const canvas = document.querySelector("canvas");
const renderer = new CanvasRenderer(canvas as HTMLCanvasElement);

renderer.setSize(window.innerWidth / 2, window.innerHeight);

const columns: number = 21;
const rows: number = 21;
const cellSize: number = Math.min(
	renderer.width / columns,
	renderer.height / rows,
);
renderer.fillRect(
	new Rect(0, 0, columns * cellSize, rows * cellSize),
	Color.white(),
);
const cells: Cell[][] = Array.from({ length: columns }, () =>
	Array.from({ length: rows }),
);
const randomCell = (): Cell => {
	const line = cells[Math.trunc(Math.random() * columns)];
	if (!line)
		throw new Error("Invalid address, something went very wrong (Row)");
	const column = line[Math.trunc(Math.random() * rows)];
	if (!column)
		throw new Error("Invalid address, something went very wrong (Column)");
	return column;
};
const getWalls = (rectangle: Rect): Array<Line> => {
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
const drawWall = (wall: Line, color: Color, width: number): void => {
	renderer.drawLine(wall.start, wall.end, color, width);
};
for (let i = 0; i < columns; i++) {
	for (let j = 0; j < rows; j++) {
		const gap = cellSize * 0.1;
		const rectangle = new Rect(
			i * cellSize + gap / 2,
			j * cellSize + gap / 2,
			cellSize - gap,
			cellSize - gap,
		);
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
console.log(randomCell());

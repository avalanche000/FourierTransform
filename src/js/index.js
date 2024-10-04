import * as UTILS from "utils";
import { drawPointsInRect } from "./draw.js";
import { arrowPath } from "./paths.js";
import { fourierTransform, fourierEvaluate, getPolar } from "./fourier.js";

const maxDepth = 50;

const sectionsSlider = UTILS.DOMUtils.useSlider("#sectionsSlider", 1, 1000);
const epicyclesSlider = UTILS.DOMUtils.useSlider("#epicyclesSlider", 0, maxDepth * 2 + 1);
const speedSlider = UTILS.DOMUtils.useSlider("#speedSlider", 0, 100);
const timeSlider = UTILS.DOMUtils.useSlider("#timeSlider", 0, 10000);

const inputCanvas = new UTILS.canvasUtils.Canvas({ DOMObject: UTILS.DOMUtils.query("#inputCanvas") });
const outputCanvas = new UTILS.canvasUtils.Canvas({ DOMObject: UTILS.DOMUtils.query("#outputCanvas") });
const tempCanvas = new UTILS.canvasUtils.Canvas({ size: [500, 500] });

const inputRect = new UTILS.shapeUtils.Rect(100, 100, 500, 500);
const outputRect = new UTILS.shapeUtils.Rect(700, 100, 500, 500);

const path = arrowPath;

let points = [path(0).toVector()];
let sections = 1;
let time = 0;
let epicycles = 1;

function drawInput() {
    inputCanvas.draw.clear();

    drawPointsInRect(inputCanvas, inputCanvas.rect, points, {
        xRange: [-1, 1],
        yRange: [-1, 1],
        closed: true,
        drawVerticalLines: false,
        drawHorizontalLines: false,
        dotSize: 3,
        lineSize: 1,
        arrowSize: 0,
        color: "white",
        lineColor: "rgba(128, 128, 128, 0.1)",
    });
}

function drawOutput() {
    outputCanvas.draw.clear();

    drawPointsInRect(outputCanvas, outputCanvas.rect, [
        [0, 0],
        math.exp(math.complex(0, 2 * math.PI * time)).toVector(),
    ], {
        xRange: [-1, 1],
        yRange: [-1, 1],
        closed: false,
        drawVerticalLines: false,
        drawHorizontalLines: false,
        dotSize: 3,
        lineSize: 1,
        arrowSize: 0,
        color: "white",
        lineColor: "rgba(128, 128, 128, 0.1)",
    });
}

sectionsSlider.useValue((newSections) => {
    sections = newSections;

    points = UTILS.arrayUtils.range(sections).map((i) => path(i / sections).toVector());

    drawInput();
});

epicyclesSlider.useValue((newEpicycles) => {
    epicycles = newEpicycles;
});

timeSlider.useValue((newTime) => {
    if (time === newTime / 10000) return;

    time = newTime / 10000;

    drawOutput();
})

setInterval(() => timeSlider.setValue((parseFloat(timeSlider.element.value) + parseFloat(speedSlider.element.value)) % 10000), 20);

drawInput();
drawOutput();

import * as UTILS from "utils";
import { canvas, drawRect, drawPointsInRect } from "./draw.js";
import { arrowPath, circlePath, infinityPath } from "./paths.js";
import { fourierTransform, fourierEvaluate, getPolar } from "./fourier.js";

const maxDepth = 50;
const sectionsSlider = UTILS.DOMUtils.useSlider("#sectionsSlider", 1, 1000);
const epicyclesSlider = UTILS.DOMUtils.useSlider("#epicyclesSlider", 0, maxDepth * 2 + 1);
const timeSlider = UTILS.DOMUtils.useSlider("#timeSlider", 0, 1, { step: 1 });
const autoCheckbox = UTILS.DOMUtils.useCheckbox("#autoCheckbox");
const displayRect = new UTILS.shapeUtils.Rect(100, 100, 500, 500);
const fouierRect = new UTILS.shapeUtils.Rect(700, 100, 500, 500);
const path = arrowPath;
const fourierSeries = fourierTransform(path, maxDepth, 360).sort((a, b) => Math.abs(a.frequency) - Math.abs(b.frequency));

let points = [path(0).toVector()];
let epicycles = 0;
let time = 0;
let fourierPoints = [[0, 0]];
let auto = false;
let prevTimestamp;

function calculateFourierPoints() {
    fourierPoints = fourierEvaluate(fourierSeries.slice(0, epicycles), parseFloat(timeSlider.element.value), true).map((complex) => complex.toVector());
}

function draw() {
    canvas.draw.clear();

    drawRect(displayRect, {
        verticalLines: [0.5],
        horizontalLines: [0.5],
    });

    drawPointsInRect(displayRect, points, {
        xRange: [-1, 1],
        yRange: [-1, 1],
        dotSize: 3,
        lineSize: 1,
        arrowSize: 0,
    });

    // drawRect(fouierRect, {
    //     verticalLines: [0.5],
    //     horizontalLines: [0.5],
    // });

    drawPointsInRect(displayRect, fourierPoints, {
        xRange: [-1, 1],
        yRange: [-1, 1],
        closed: false,
        dotSize: 0,
        lineSize: 1,
        arrowSize: 0,
        color: "black",
    });
}

function update(timestamp) {
    let dt;

    if (prevTimestamp == null) {
        dt = 0;
    } else {
        dt = timestamp - prevTimestamp;
    }

    prevTimestamp = timestamp;

    if (auto) {
        time = (time + dt / 1000 / 10) % 1;

        timeSlider.element.value = time;

        calculateFourierPoints();

        draw();
    }

    requestAnimationFrame(update);
}

sectionsSlider.useValue((sections) => {
    points = UTILS.arrayUtils.range(sections).map((n) => path(n / sections).toVector());

    timeSlider.element.step = 1 / sections;

    draw();
});

epicyclesSlider.useValue((newEpicycles) => {
    epicycles = newEpicycles;

    calculateFourierPoints();

    draw();
});

timeSlider.useValue((newTime) => {
    autoCheckbox.setChecked(false);

    time = newTime;

    calculateFourierPoints();

    draw();
});

autoCheckbox.useChecked((newAuto) => {
    auto = newAuto;
});

window.addEventListener("resize", () => draw());

draw();

update();

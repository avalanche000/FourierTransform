import * as UTILS from "utils";

function drawRect(canvas, rect, options) {
    options = UTILS.functionUtils.createOptions({ verticalLines: [], horizontalLines: [], color: "gray", lineColor: "gray" }, options);

    options.verticalLines.forEach((xPercent) => canvas.draw.line(
        options.lineColor,
        rect.getAnchor([xPercent, 0]),
        rect.getAnchor([xPercent, 1]),
    ));

    options.horizontalLines.forEach((yPercent) => canvas.draw.line(
        options.lineColor,
        rect.getAnchor([0, yPercent]),
        rect.getAnchor([1, yPercent]),
    ));

    canvas.draw.rect(options.color, rect.toArray(), 1);
}

function drawPointsInRect(canvas, rect, points, options) {
    if (points.length === 0) return;

    options = UTILS.functionUtils.createOptions({
        xRange: [0, 1],
        yRange: [0, 1],
        closed: true,
        drawVerticalLines: false,
        drawHorizontalLines: false,
        dotSize: 3,
        lineSize: 0,
        arrowSize: 0,
        color: "white",
        lineColor: "rgba(128, 128, 128, 0.1)",
    }, options);

    let prevPosition = rect.getAnchor([
        UTILS.numberUtils.map(...options.xRange, 0, 1, points[points.length - 1][0]),
        UTILS.numberUtils.map(...options.yRange, 1, 0, points[points.length - 1][1]), // reversed because of weird canvas stuff
    ]);

    for (let i = 0; i < points.length; i++) {
        const point = [
            UTILS.numberUtils.map(...options.xRange, 0, 1, points[i][0]),
            UTILS.numberUtils.map(...options.yRange, 1, 0, points[i][1]), // reversed because of weird canvas stuff
        ];
        const position = rect.getAnchor(point);

        if (options.drawVerticalLines) {
            canvas.draw.line(options.lineColor, rect.getAnchor([point[0], 1]), rect.getAnchor([point[0], 0]));
        }
        if (options.drawHorizontalLines) {
            canvas.draw.line(options.lineColor, rect.getAnchor([0, point[1]]), rect.getAnchor([1, point[1]]));
        }

        if (options.dotSize !== 0) canvas.draw.circle(options.color, position, options.dotSize);

        if (options.lineSize !== 0 && (options.closed || i > 0)) {
            canvas.draw.line(options.color, position, prevPosition, options.lineSize);

            if (options.arrowSize !== 0) {
                const angle = math.atan2(prevPosition[1] - position[1], position[0] - prevPosition[0]);
                const arrowPoints = [
                    [0, 0],
                    [-1 * options.arrowSize, 0.4 * options.arrowSize],
                    [-1 * options.arrowSize, -0.4 * options.arrowSize],
                ].map((arrowPoint) => [
                    arrowPoint[0] * math.cos(angle) - arrowPoint[1] * math.sin(angle) + position[0],
                    -(arrowPoint[0] * math.sin(angle) + arrowPoint[1] * math.cos(angle)) + position[1], // reversed because of weird canvas stuff
                ]);

                canvas.draw.poly(options.color, arrowPoints);
            }
        }

        prevPosition = position;
    }
}

export { drawRect, drawPointsInRect };

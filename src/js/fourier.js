import * as UTILS from "utils";

const twoPII = math.complex(0, 2 * math.PI);
const twoPIIMul = (x) => twoPII.mul(x);

// calculates a trapezoidal sum of a complex function with the specified number of sub-intervals
function trapezoidalSum(f, a, b, subIntervals = 100) {
    const range = b - a;
    const dx = range / subIntervals;

    let sum = math.complex();

    for (let i = 0; i < subIntervals; i++) {
        sum = sum.add(f(i * dx + a).add(f((i + 1) * dx + a)));
    }

    return sum.mul(dx / 2);
}

// will resuse the first point as the last
function trapezoidalSumPoints(complexPoints) {
    let sum = math.complex();

    for (let i = 0; i < complexPoints.length; i++) {
        sum = sum.add(complexPoints[i].add(complexPoints[(i + 1) % complexPoints.length]));
    }

    return sum.div(complexPoints.length * 2);
}

/**
 * Calculates the coefficients of a fourier series for the function f with certain values to adjust precision
 * @param {Function} f - The function to calculate a fourier series for on range [0, 1]
 * @param {number} depth - The number of epicycles to use to aproximate
 * @param {number} subIntervals - The number of sub-intervals to use while integrating
 * @returns {{frequency: number, coefficient: math.Complex}} An object containing the frequency and the coeffiecients of the fourier series
 */
function fourierTransform(f, depth, subIntervals = 100) {
    return UTILS.arrayUtils.range(-depth, depth + 1).map((frequency) => ({
        frequency,
        coefficient: trapezoidalSum(
            (t) => f(t).mul(math.exp(twoPIIMul(-frequency * t))),
            0,
            1,
            subIntervals,
        ),
    }));
}

function discreteFourierTransform(complexPoints, depth) {
    return UTILS.arrayUtils.range(-depth, depth + 1).map((frequency) => ({
        frequency,
        coefficient: trapezoidalSumPoints(complexPoints),
    }));
}

function fourierEvaluate(fourierSeries, t, returnAll = false) {
    let allSums = [math.complex()];
    let sum = math.complex();

    for (let i = 0; i < fourierSeries.length; i++) {
        sum = sum.add(math.exp(twoPIIMul(fourierSeries[i].frequency * t)).mul(fourierSeries[i].coefficient));

        if (returnAll) allSums.push(sum);
    }

    return returnAll ? allSums : sum;
}

// converts complex coeficients into their polar counterpoints to be used with the sine and cosine functions
function getPolar(fourierSeries) {
    const polarData = fourierSeries.map((data) => {
        const polar = data.coefficient.toPolar();

        return {
            frequency: data.frequency,
            amplitude: polar.r,
            phase: polar.phi,
        };
    });

    return polarData;
}

export { fourierTransform, discreteFourierTransform, fourierEvaluate, getPolar };

const twoPI = 2 * math.PI;
const twoPII = math.complex(0, twoPI);
const twoPIIMul = (x) => twoPII.mul(x);

function lerpT(start, end, startTime, endTime, t) {
    const complexStart = math.complex(...start);
    const complexEnd = math.complex(...end);
    const range = complexEnd.sub(complexStart);

    return complexStart.add(range.mul((t - startTime) / (endTime - startTime)));
}

function pointsPath(...points) {
    return (t) => {
        const i = math.floor(t * points.length);
        const p1 = points[i % points.length];
        const p2 = points[(i + 1) % points.length];

        return lerpT(p1, p2, i / points.length, (i + 1) / points.length, t);
    }
}

const arrowPath = pointsPath([0, 1], [-1, 0.3], [-0.3, 0.3], [-0.3, -1], [0.3, -1], [0.3, 0.3], [1, 0.3]);
const circlePath = (t) => math.exp(math.complex(0, 2 * math.PI * t));
const infinityPath = (t) => math.complex(math.cos(twoPI * t), math.sin(2 * twoPI * t) * 0.5);

export { arrowPath, circlePath, infinityPath };

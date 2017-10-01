export function toPerCent(value, total) {
    return Number(((value * 100) / total).toFixed(2));
}

export function areFloatsEqual(a, b) {
    return Math.abs(a - b) < Number.EPSILON;
}

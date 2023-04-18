type Increments = number | number[];

export default class Dice {
    private readonly sides: number;

    constructor(sides: number) {
        this.sides = sides;
    }

    roll(increments: Increments = [], min = undefined): number {
        const dice = Math.floor(Math.random() * this.sides) + 1;
        const increment = Array.isArray(increments) ? increments.reduce((a, b) => a + b, 0) : increments;
        const result = dice + increment;
        return min ? Math.max(result, min) : result;
    }
}
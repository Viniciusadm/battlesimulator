type Increments = number | number[];

export default class Dice {
    private readonly sides: number;

    constructor(sides: number) {
        this.sides = sides;
    }

    roll(increments: Increments = []): number {
        const dice = Math.floor(Math.random() * this.sides) + 1;
        const increment = Array.isArray(increments) ? increments.reduce((a, b) => a + b, 0) : increments;
        return dice + increment;
    }
}
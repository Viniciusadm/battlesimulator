type Increments = number | number[];

type roll = {
    value: number,
    dice: number,
    increment: number,
}

export default class Dice {
    private readonly sides: number;

    constructor(sides: number) {
        this.sides = sides;
    }

    roll(increments: Increments = [], min: number|undefined = undefined): roll {
        const dice = Math.floor(Math.random() * this.sides) + 1;
        const increment = Array.isArray(increments) ? increments.reduce((a, b) => a + b, 0) : increments;
        const result = dice + increment;
        return {
            value: min ? Math.max(result, min) : result,
            dice,
            increment,
        };
    }
}
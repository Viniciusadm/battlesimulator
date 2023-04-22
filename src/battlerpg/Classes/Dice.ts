type Increments = number | number[];

type rolls = { dice: string, value: number }[];

export type roll = {
    value: number,
    increment: number,
    rolls: rolls,
}

export default class Dice {
    private readonly sides: number;

    constructor(sides: number) {
        this.sides = sides;
    }

    public roll(increments: Increments = [], min: number|undefined = undefined): roll {
        const dice = Math.floor(Math.random() * this.sides) + 1;
        const increment = Array.isArray(increments) ? increments.reduce((a, b) => a + b, 0) : increments;
        const result = dice + increment;
        return {
            value: min ? Math.max(result, min) : result,
            increment,
            rolls: [{
                dice: Dice.diceToString(this),
                value: dice,
            }],
        };
    }

    public static rollMultiple(dices: Dice[], increments: Increments = [], min: number|undefined = undefined): roll {
        const rolls: { dice: string, value: number }[] = [];
        const result = dices.map(dice => {
            const roll = dice.roll();
            rolls.push({
                dice: Dice.diceToString(dice),
                value: roll.value,
            });
            return roll;
        }).reduce((a, b) => a + b.value, 0);
        const increment = Array.isArray(increments) ? increments.reduce((a, b) => a + b, 0) : increments;
        const value = result + increment;
        return {
            value: min ? Math.max(value, min) : value,
            increment,
            rolls,
        }
    }

    private static diceToString(dice: Dice): string {
        return `d${dice.sides}`;
    }
}
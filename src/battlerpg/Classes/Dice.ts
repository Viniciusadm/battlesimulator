type rolls = { dice: string, value: number }[];

export type roll = {
    value: number,
    increment: number,
    rolls: rolls,
}

export default class Dice {
    private readonly sides: number;
    private readonly count: number;
    private readonly modifier: number;

    constructor(sides: number, count: number = 1, modifier: number = 0) {
        this.sides = sides;
        this.count = count;
        this.modifier = modifier;
    }

    public roll(increment = 0, min: number|undefined = undefined): roll {
        const rolls: { dice: string, value: number }[] = [];
        const result = Array(this.count).fill(0).map(() => {
            const roll = Math.floor(Math.random() * this.sides) + 1;
            rolls.push({
                dice: this.diceToString(),
                value: roll,
            });
            return roll;
        }).reduce((a, b) => a + b, 0);
        const value = result + this.modifier;
        return {
            value: min ? Math.max(value, min) : value,
            increment: this.modifier + increment,
            rolls,
        }
    }

    public static rollMultiple(dice: Dice[], increment = 0, min: number|undefined = undefined): roll {
        const rolls: { dice: string, value: number }[] = [];
        const result = dice.map(d => {
            const roll = d.roll();
            rolls.push(...roll.rolls);
            return roll.value;
        }).reduce((a, b) => a + b, 0);
        const value = result + increment;
        return {
            value: min ? Math.max(value, min) : value,
            increment,
            rolls,
        }
    }

    public diceToString(): string {
        return `d${this.sides}`;
    }

    public static parseDiceString(diceString: string): Dice[] {
        const diceList = diceString.split(",");

        const dice: Dice[] = [];

        for (const diceItem of diceList) {
            const countString = diceItem.split("d")[0];
            const sidesString = diceItem.split("d")[1].split("+")[0];
            const modifierString = diceItem.split("+")[1];

            const count = parseInt(countString || "1");
            const sides = parseInt(sidesString);
            const modifier = parseInt(modifierString || "0");

            dice.push(new Dice(sides, count, modifier));
        }

        return dice;
    }
}
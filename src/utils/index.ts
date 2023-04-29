type TypeDice = {
    count: number;
    sides: number;
    modifier: number;
}

export function parseDiceString(diceString: string) {
    const diceList = diceString.split(",");

    const dice: TypeDice[] = [];

    for (const diceItem of diceList) {
        const countString = diceItem.split("d")[0];
        const sidesString = diceItem.split("d")[1].split("+")[0];
        const modifierString = diceItem.split("+")[1];

        const count = parseInt(countString || "1");
        const sides = parseInt(sidesString);
        const modifier = parseInt(modifierString || "0");

        dice.push({count, sides, modifier});
    }

    return dice;
}
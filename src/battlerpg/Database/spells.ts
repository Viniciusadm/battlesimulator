type Dices = 4 | 6 | 8 | 10 | 12;

export type Spell = {
    name: string;
    energyCost: number;
    dices: Dices[];
    type: 'attack' | 'heal';
};


const spells: Spell[] = [];

const addSpell = (spell: Spell) => {
    spells.push(spell);
}

const getSpell = (name: string): Spell | undefined => {
    return spells.find(spell => spell.name === name);
}

export { addSpell, getSpell };
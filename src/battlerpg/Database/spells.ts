import Dice from "@/battlerpg/Classes/Dice";

export type Spell = {
    name: string;
    energyCost: number;
    dices: Dice[];
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
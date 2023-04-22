import Dice from "@/battlerpg/Classes/Dice";
import { d12, d4 } from "@/battlerpg/Helpers/dices";

export type Spell = {
    name: string;
    energyCost: number;
    dices: Dice[];
    type: 'attack' | 'heal';
};


const spells: Spell[] = [
    {
        name: "Explosion",
        energyCost: 9,
        type: "attack",
        dices: [d12, d4],
    },
    {
        name: "Heal",
        energyCost: 9,
        type: "heal",
        dices: [d12],
    }
];

const addSpell = (spell: Spell) => {
    spells.push(spell);
}

const getSpell = (name: string): Spell | undefined => {
    return spells.find(spell => spell.name === name);
}

export { addSpell, getSpell };
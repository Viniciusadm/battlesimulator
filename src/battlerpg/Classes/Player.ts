import Character from "./Abstracts/Character";
import { d20, d4, d6 } from "../Helpers/dices";
import { Spell } from "../Database/spells";
import Dice, { roll } from "./Dice";

export type PlayerSkills = {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
};

export default class Player extends Character {
    private readonly skills: PlayerSkills;
    private readonly spells: Spell[] = [];
    private energy: number = 0;

    constructor(attributes: { name: string }, skills: PlayerSkills) {
        super(attributes);
        this.skills = skills;
        this.attributes = {...attributes, life: this.getInitialLife(), totalLife: this.getInitialLife()};
        this.energy = this.getMaxEnergy();
    }

    public getExpecifiedSkill(skill: keyof PlayerSkills): number {
        return Math.floor((this.skills[skill] - 10) / 2);
    }

    public getResumedSkills(): string {
        let skills = '';
        skills += `strength: ${this.skills.strength}, `;
        skills += `dexterity: ${this.skills.dexterity}, `;
        skills += `constitution: ${this.skills.constitution}, `;
        skills += `life: ${this.attributes.life}, `;
        skills += `armor: ${this.getCalculatedArmor()}`;
        return skills;
    }

    public tryToHit(target: Player): roll & { success: boolean } {
        const playerDexterity = this.getExpecifiedSkill('strength');
        const roll = d20.roll(playerDexterity);
        return {
            ...roll,
            success: roll.value >= target.getCalculatedArmor(),
        }
    }

    public attack(): roll {
        if (!this.watch.weapon) {
            return d4.roll(this.getExpecifiedSkill('strength'));
        } else {
            const skill = this.watch.weapon.type === 'melee' ? 'strength' : 'dexterity';
            return this.watch.weapon.dice.roll(this.getExpecifiedSkill(skill));
        }
    }

    public heal(potion = 'Potion'): number {
        if (this.removeInventory(potion, 1)) {
            return d6.roll(this.getExpecifiedSkill('wisdom')).value;
        }
        return 0;
    }

    private getInitialLife(): number {
        return 10 + this.getExpecifiedSkill('constitution');
    }

    public getCalculatedArmor(): number {
        if (this.watch.armor) {
            return this.watch.armor.value + (this.watch.armor.incrementable ? this.getExpecifiedSkill('dexterity') : 0);
        }

        return 10 + this.getExpecifiedSkill('dexterity');
    }

    public getMaxEnergy(): number {
        return 20 + this.getExpecifiedSkill('intelligence') * 2;
    }

    public addSpell(spell: Spell): void {
        this.spells.push(spell);
    }

    private decreaseEnergy(spell: Spell): void {
        this.energy -= spell.energyCost;
    }

    public useSpell(spell: Spell, resists: number = 0): roll|boolean {
        if (spell && this.energy >= spell.energyCost) {
            this.decreaseEnergy(spell);

            if (resists > this.getMyResist()) {
                return false;
            }

            return  Dice.rollMultiple(spell.dices, this.getExpecifiedSkill('intelligence'));
        }

        return false;
    }

    public canSpell(spellName: string): boolean {
        const spell = this.getSpell(spellName);
        if (!spell) {
            return false;
        }

        return this.energy >= spell.energyCost;
    }

    public getSpell(spellName: string): Spell | undefined {
        return this.spells.find(spell => spell.name === spellName);
    }

    public setEnergyInMax(): void {
        this.energy = this.getMaxEnergy();
    }

    private getMyResist(): number {
        return 8 + this.getExpecifiedSkill('intelligence');
    }

    public getEnergy(): number {
        return this.energy;
    }
}
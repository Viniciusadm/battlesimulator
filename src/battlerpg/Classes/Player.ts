import Character from "./Abstracts/Character";
import { d20, d6 } from "../Helpers/dices";
import { Spell } from "../Database/spells";
import Dice from "./Dice";

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
    private readonly armor: number = 0;
    private energy: number = 0;

    constructor(attributes: { name: string }, skills: PlayerSkills) {
        super(attributes);
        this.skills = skills;
        this.attributes = {...attributes, life: this.getInitialLife(), totalLife: this.getInitialLife()};
        this.armor = this.getCalculatedArmor();
        this.energy = this.getCalculatedEnergy();
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
        skills += `armor: ${this.armor}`;
        return skills;
    }

    public tryToHit(target: Player): boolean {
        const playerDexterity = this.getExpecifiedSkill('strength');
        const { value: playerHit } = d20.roll(playerDexterity);
        return playerHit > target.armor;
    }

    public attack(): number {
        return d6.roll(this.getExpecifiedSkill('strength')).value;
    }

    public heal(): number {
        if (this.removeInventory('Potion', 1)) {
            return d6.roll(this.getExpecifiedSkill('wisdom')).value;
        }
        return 0;
    }

    private getInitialLife(): number {
        return 10 + this.getExpecifiedSkill('constitution');
    }

    private getCalculatedArmor(): number {
        return 10 + this.getExpecifiedSkill('dexterity');
    }

    private getCalculatedEnergy(): number {
        return 20 + this.getExpecifiedSkill('intelligence') * 2;
    }

    public addSpell(spell: Spell): void {
        this.spells.push(spell);
    }

    private decreaseEnergy(spell: Spell): void {
        this.energy -= spell.energyCost;
    }

    public useSpell(spell: Spell, resists: number): number|boolean {
        if (spell && this.energy >= spell.energyCost) {
            this.decreaseEnergy(spell);

            if (resists > this.getMyResist()) {
                return false;
            }

            let total = 0;

            for (const dice of spell.dices) {
                const { value} = new Dice(dice).roll();
                total += value;
            }

            return total + this.getExpecifiedSkill('intelligence');
        }

        return 0;
    }

    public canSpell(spellName: string): boolean {
        const spell = this.getSpell(spellName);
        return spell && this.energy >= spell.energyCost;
    }

    public getSpell(spellName: string): Spell | undefined {
        return this.spells.find(spell => spell.name === spellName);
    }

    public setEnergyInMax(): void {
        this.energy = this.getCalculatedEnergy();
    }

    private getMyResist(): number {
        return 8 + this.getExpecifiedSkill('intelligence');
    }
}
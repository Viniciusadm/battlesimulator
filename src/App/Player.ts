import { d6, d20 } from "@/functions/dices";
import Character from "@/App/Character";

export type PlayerSkills = {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
};

export class Player extends Character {
    private readonly skills: PlayerSkills;
    private readonly armor: number = 0;

    constructor(attributes: { name: string }, skills: PlayerSkills) {
        super(attributes);
        this.skills = skills;
        this.attributes = { ...attributes, life: this.getInitialLife(), totalLife: this.getInitialLife() };
        this.armor = this.getCalculatedArmor();
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
}
import { d20 } from "@/functions/dices";

export type PlayerAttributes = {
    name: string;
    life: number;
};

export type PlayerSkills = {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
};

export class Player {
    private readonly skills: PlayerSkills;
    private attributes: PlayerAttributes;

    constructor(attributes: PlayerAttributes, skills: PlayerSkills) {
        this.attributes = attributes;
        this.skills = skills; 
    }

    getName(): string {
        return this.attributes.name;
    }

    isAlive(): boolean {
        return this.attributes.life > 0;
    }

    getExpecifiedSkill(skill: keyof PlayerSkills): number {
        return this.skills[skill];
    }

    decreaseLife(amount: number): number {
        this.attributes.life -= amount;
        return this.attributes.life;
    }

    increaseLife(amount: number): number {
        this.attributes.life += amount;
        return this.attributes.life;
    }

    attack(): number {
        return d20.roll(this.skills.strength);
    }
}
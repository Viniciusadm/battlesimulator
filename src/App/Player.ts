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

type Skill = keyof PlayerSkills;

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
        return Math.floor(this.skills[skill] / 2);
    }

    getResumedSkills(): string {
        let skills = '';
        for (const skill in this.skills as PlayerSkills) {
            skills += `${skill}: ${this.skills[skill as Skill]}, `;
        }
        skills += `life: ${this.attributes.life}`;
        return skills;
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
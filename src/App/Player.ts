import { d20 } from "@/functions/dices";

export type PlayerAttributes = {
    name: string;
    life: number;
    totalLife?: number;
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
        this.attributes = { ...attributes, totalLife: attributes.life}
        this.skills = skills; 
    }

    getName(): string {
        return this.attributes.name;
    }

    getLife(): number {
        if (!this.attributes.totalLife) return 0;
        return Number(this.attributes.life / this.attributes.totalLife * 100);
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

    setLifeInMax(): number {
        this.attributes.life = this.attributes.totalLife as number;
        return this.attributes.life;
    }

    public tryToHit(target: Player): boolean {
        const playerDexterity = this.getExpecifiedSkill('strength');
        const targetDexterity = target.getExpecifiedSkill('dexterity');
        const playerHit = d20.roll(playerDexterity);
        const targetDodge = d20.roll(targetDexterity);
        return playerHit > targetDodge;
    }

    attack(): number {
        return d20.roll(this.skills.strength);
    }
}
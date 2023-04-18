import { d6, d20 } from "@/functions/dices";

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
    private armor: number = 0;

    constructor(attributes: Omit<PlayerAttributes, 'life'>, skills: PlayerSkills) {
        this.skills = skills;
        this.attributes = { ...attributes, life: this.getInitialLife() };
        this.attributes.totalLife = this.attributes.life;
        this.armor = this.getCalculatedArmor();
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
        return Math.floor((this.skills[skill] - 10) / 2);
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
        const { value: playerHit } = d20.roll(playerDexterity);
        return playerHit > target.armor;
    }

    attack(): number {
        return d6.roll(this.getExpecifiedSkill('strength')).value;
    }

    private getInitialLife(): number {
        return 10 + this.getExpecifiedSkill('constitution');
    }

    private getCalculatedArmor(): number {
        return 10 + this.getExpecifiedSkill('dexterity');
    }
}
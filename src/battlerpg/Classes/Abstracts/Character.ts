import Inventory from "./Inventory";

export type CharacterAttributes = {
    name: string;
    life: number;
    totalLife: number;
};

export default class Character extends Inventory {
    protected attributes: CharacterAttributes;

    constructor(attributes: { name: string }) {
        super();
        this.attributes = { ...attributes, life: 10, totalLife: 10 };
    }

    public getName(): string {
        return this.attributes.name;
    }

    public getLife(): number {
        if (!this.attributes.totalLife) return 0;
        return Number(this.attributes.life / this.attributes.totalLife * 100);
    }

    public decreaseLife(amount: number): number {
        this.attributes.life -= amount;
        return this.attributes.life;
    }

    public increaseLife(amount: number): number {
        this.attributes.life += amount;
        return this.attributes.life;
    }

    public setLifeInMax(): number {
        this.attributes.life = this.attributes.totalLife as number;
        return this.attributes.life;
    }

    public isAlive(): boolean {
        return this.attributes.life > 0;
    }

    public isDangerous(): boolean {
        return this.attributes.life < (this.attributes.totalLife / 2);
    }
}
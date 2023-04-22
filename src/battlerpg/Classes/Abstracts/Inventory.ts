export type InventoryItems = {
    name: string;
    quantity: number;
};

type Watch = {
    armor: {
        value: number,
        incrementable: boolean
    } | undefined;
}

export default class Inventory {
    private inventory: InventoryItems[] = [];
    protected watch: Watch = {
        armor: undefined,
    }

    public addInventory(name: string, quantity: number): void {
        const item = this.inventory.find(item => item.name === name);
        if (item) {
            item.quantity += quantity;
        } else {
            this.inventory.push({ name, quantity });
        }
    }

    public setInventory(name: string, quantity: number): void {
        const item = this.inventory.find(item => item.name === name);
        if (item) {
            item.quantity = quantity;
        } else {
            this.inventory.push({ name, quantity });
        }
    }

    public removeInventory(name: string, quantity: number): boolean {
        const item = this.inventory.find(item => item.name === name);
        if (item) {
            item.quantity -= quantity;
            return true;
        }
        return false;
    }

    public getInventory(): InventoryItems[] {
        return this.inventory;
    }

    public getQuantity(name: string): number {
        const item = this.inventory.find(item => item.name === name);
        if (item) {
            return item.quantity;
        }
        return 0;
    }

    public setWatchArmor(value: number, incrementable: boolean): void {
        this.watch.armor = { value, incrementable };
    }
}
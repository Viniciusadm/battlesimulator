export type InventoryItems = {
    name: string;
    quantity: number;
};

export default class Inventory {
    private inventory: InventoryItems[] = [];

    public addInventory(name: string, quantity: number): void {
        const item = this.inventory.find(item => item.name === name);
        if (item) {
            item.quantity += quantity;
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
}
import { Player } from "@/App/Player";
import { d20 } from "@/functions/dices";

export class Battle {
    private readonly player1: Player;
    private readonly player2: Player;

    constructor(player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1.setLifeInMax();
        this.player2.setLifeInMax();
    }

    public getInitiative(): Player[] {
        const order: number[] = [];
        order.push(d20.roll(this.player1.getExpecifiedSkill('dexterity')).value);
        order.push(d20.roll(this.player2.getExpecifiedSkill('dexterity')).value);
        if (order[0] > order[1]) {
            return [this.player1, this.player2];
        } else {
            return [this.player2, this.player1];
        }
    }
}
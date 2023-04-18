import { Player } from "@/App/Player";
import { d20 } from "@/functions/dices";

export class Battle {
    private readonly player1: Player;
    private readonly player2: Player;
    private readonly primary: Player;
    private readonly secondary: Player;

    constructor(player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
        this.primary = this.getInitiative(player1, player2);
        this.secondary = this.primary === player1 ? player2 : player1;
    }

    private start(): void {
        console.log(`${this.player1.getName()} vs ${this.player2.getName()}`);
        console.log(`${this.primary.getName()} has the initiative!`);
    }

    private end(): void {
        if (this.player1.isAlive()) {
            console.log(`${this.player1.getName()} win!`);
        } else {
            console.log(`${this.player2.getName()} win!`);
        }
    }

    private getInitiative(player1: Player, player2: Player): Player {
        const player1Initiative = d20.roll(player1.getExpecifiedSkill('dexterity'));
        const player2Initiative = d20.roll(player2.getExpecifiedSkill('dexterity'));
        if (player1Initiative > player2Initiative) {
            return player1;
        } else {
            return player2;
        }
    }

    fight(): void {
        this.start();
        while (true) {
            this.secondary.decreaseLife(this.primary.attack());
            if (!this.secondary.isAlive()) {
                break;
            }

            this.primary.decreaseLife(this.secondary.attack());
            if (!this.primary.isAlive()) {
                break;
            }
        }
        this.end();
    }
}
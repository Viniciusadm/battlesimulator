import { Player } from "@/App/Player";
import { d20 } from "@/functions/dices";

export class Battle {
    private readonly player1: Player;
    private readonly player2: Player;
    private readonly primary: Player;
    private readonly secondary: Player;
    private readonly logs: string[] = [];

    constructor(player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
        this.primary = this.getInitiative(player1, player2);
        this.secondary = this.primary === player1 ? player2 : player1;
    }

    private log(message: string): void {
        this.logs.push(message);
    }

    private start(): void {
        this.log(`${this.player1.getName()} vs ${this.player2.getName()}`);
        this.log(`${this.primary.getName()} has the initiative!`);
        this.log(`${this.player1.getName()} has ${this.player1.getResumedSkills()}`);
        this.log(`${this.player2.getName()} has ${this.player2.getResumedSkills()}`);
    }

    private end(): void {
        if (this.player1.isAlive()) {
            this.log(`${this.player1.getName()} win!`);
        } else {
            this.log(`${this.player2.getName()} win!`);
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
            const primaryAttack = this.primary.attack();
            const secondaryLife = this.secondary.decreaseLife(primaryAttack);
            this.log(`${this.primary.getName()} attack ${this.secondary.getName()} with ${primaryAttack} and ${this.secondary.getName()} has ${secondaryLife} life`);
            if (!this.secondary.isAlive()) {
                break;
            }

            const secondaryAttack = this.secondary.attack();
            const primaryDefense = this.primary.decreaseLife(secondaryAttack);
            this.log(`${this.secondary.getName()} attack ${this.primary.getName()} with ${secondaryAttack} and ${this.primary.getName()} has ${primaryDefense} life`);
            if (!this.primary.isAlive()) {
                break;
            }
        }
        this.end();
    }

    getLogs(): string[] {
        return this.logs;
    }
}
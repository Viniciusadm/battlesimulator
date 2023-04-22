import { useEffect, useState } from "react";
import Battle from "@/battlerpg/Classes/Battle";
import Player from "@/battlerpg/Classes/Player";
import { addSpell, getSpell, Spell } from "@/battlerpg/Database/spells";
import { d12, d20 } from "@/battlerpg/Helpers/dices";
import { roll } from "@/battlerpg/Classes/Dice";

type Log = {
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

function PlayerStatus({ player }: { player: Player }) {
    const life = player.getLife() > 0 ? player.getLife().toFixed(2) : 0;
    return (
        <div className="flex flex-col items-center mr-3 w-2/5">
            <p className="text-2xl font-bold mb-1">{player.getName()}</p>
            <div className="bg-gray-300 h-8 rounded-full mb-2 w-full relative flex items-center">
                <p className="text-white font-bold z-10 absolute w-full text-center">
                    {life}%
                </p>
                <div
                    className="bg-green-500 h-8 rounded-full transition-all duration-1000 absolute top-0"
                    style={{ width: `${life}%` }}
                >
                </div>
            </div>

            <div className="bg-gray-300 h-8 rounded-full mb-2 w-full relative flex items-center">
                <p className="text-white font-bold z-10 absolute w-full text-center">
                    {player.getEnergy()} / {player.getMaxEnergy()}
                </p>
                <div
                    className="bg-blue-500 h-8 rounded-full transition-all duration-1000 absolute top-0"
                    style={{ width: `${player.getEnergy() / player.getMaxEnergy() * 100}%` }}
                >
                </div>
            </div>

            <p>Potions: {player.getQuantity('Potion')}</p>
        </div>
    );
}

export default function Home() {
    const [logsInScreen, setLogsInScreen] = useState<Log[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);

    const addLog = (message: string) => {
        setLogsInScreen((prev) => [...prev, {
            message,
            type: 'info',
        }
    ]);
    }

    const addSpells = () => {
        addSpell({
            name: "Explosion",
            energyCost: 18,
            type: "attack",
            dices: [d12],
        });
    }

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    useEffect(() => {
        addSpells();

        const Kazuma = new Player({
            name: "Kazuma",
        }, {
            strength: 15,
            dexterity: 12,
            charisma: 13,
            constitution: 14,
            intelligence: 8,
            wisdom: 10,
        });

        const Megumin = new Player({
            name: "Megumin",
        }, {
            strength: 13,
            dexterity: 15,
            charisma: 12,
            constitution: 14,
            intelligence: 8,
            wisdom: 10,
        });

        Kazuma.addInventory('Potion', 3);
        Megumin.addInventory('Potion', 3);

        const firebal = getSpell('Explosion');
        if (firebal) {
            Megumin.addSpell(firebal);
        }

        setPlayers([Kazuma, Megumin]);
    }, []);

    const initialLogs = async (first: Player, second: Player) => {
        addLog(`${first.getName()} vs ${second.getName()}`);

        await sleep(1000);

        addLog(`${first.getName()} has ${first.getResumedSkills()}`);
        addLog(`${second.getName()} has ${second.getResumedSkills()}`);

        await sleep(1000);

        addLog(`${first.getName()} is going to attack first`);

        await sleep(1000);
    }

    const drinkPotion = async (attacker: Player) => {
        const potions = attacker.getQuantity('Potion');
        if (potions > 0 && attacker.isDangerous()) {
            const heal = attacker.heal();
            attacker.increaseLife(heal);
            addLog(`${attacker.getName()} heals ${heal} life and has ${potions - 1} potions left`);
            await sleep(1000);
        }
    }

    const attack = async (attacker: Player, attacked: Player) => {
        const attempt = attacker.tryToHit(attacked);
        if (attempt.success) {
            const attack = attacker.attack();
            const life = attacked.decreaseLife(attack.value);
            addLog(`${attacker.getName()} hits ${attacked.getName()} with ${attack.value} damage, ${attacked.getName()} has ${life} life`);
            await sleep(1000);
        } else {
            addLog(`${attacker.getName()} rolled a ${attempt.value} and missed`);
            await sleep(900);
        }
    }

    const spell = async (attacker: Player, attacked: Player, spell: Spell) => {
        const resists = d20.roll().value;

        const attempt = attacker.useSpell(spell, resists);
        if (attempt) {
            const damage = (attempt as roll).value;
            const life = attacked.decreaseLife(damage);
            addLog(`${attacker.getName()} uses Explosion and hits ${attacked.getName()} with ${damage} damage, ${attacked.getName()} has ${life} life`);
        } else {
            addLog(`${attacker.getName()} tries to use Explosion but fails`);
        }

        await sleep(1000);
    }

    const turn = async (attacker: Player, attacked: Player): Promise<void> => {
        await drinkPotion(attacker);

        if (attacker.canSpell('Explosion')) {
            await spell(attacker, attacked, getSpell('Explosion') as Spell);
        } else {
            await attack(attacker, attacked);
        }
    }

    const verifyDead = (player: Player): boolean => {
        if (!player.isAlive()) {
            addLog(`${player.getName()} is dead`);
            return true;
        }

        return false;
    }

    const startBattle = async () => {
        setLogsInScreen([]);
        const battle = new Battle(players[0], players[1]);
        const order = battle.getInitiative();

        if (order.length === 2) {
            const [first, second] = order;

            await initialLogs(first, second);

            while (true) {
                await turn(first, second);

                if (verifyDead(second)) {
                    break;
                }

                await turn(second, first);

                if (verifyDead(first)) {
                    break;
                }
            }
        }
    }

    return (
        <main className="flex flex-col items-center py-2 mx-auto w-full max-w-4xl px-4">
            <h1 className="text-4xl text-center font-bold">Battle Simulator</h1>

            <button onClick={startBattle} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4">
                Start Battle
            </button>

            {
                players.length > 0 && (
                    <div className="flex flex-row items-center justify-center mb-4 w-full">
                        <PlayerStatus player={players[0]} />
                        <PlayerStatus player={players[1]} />
                    </div>
                )
            }

            <div className="flex flex-col items-center">
                {logsInScreen.map((log, index) => (
                    <p
                        key={index}
                        className="mb-2 text-center"
                    >
                        {log.message}
                    </p>
                ))}
            </div>
        </main>
    );
}

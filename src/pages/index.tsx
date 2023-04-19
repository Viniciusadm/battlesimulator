import { useEffect, useState } from "react";
import { Battle, Player } from "../../node_modules/battlerpg/dist/index";

type Log = {
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

function LifeBar({ life }: { life: number }) {
    return (
        <>
            <div className="bg-gray-200 h-6 rounded-full mb-2 w-full">
                <div
                    className="bg-green-500 h-6 rounded-full transition-all duration-1000"
                    style={{ width: `${life}%` }}
                >
                </div>
            </div>
            <p className="text-center">{life.toFixed(2)}%</p>
        </>
    );
}

export default function Home() {
    const [logsInScreen, setLogsInScreen] = useState<Log[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    useEffect(() => {
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

        setPlayers([Kazuma, Megumin]);
    }, []);

    const initialLogs = async (first: Player, second: Player) => {
        setLogsInScreen((prev) => [...prev, {
            message: `${first.getName()} vs ${second.getName()}`,
            type: 'info',
        }]);

        await sleep(1000);

        setLogsInScreen((prev) => [...prev, {
            message: `${first.getName()} has ${first.getResumedSkills()}`,
            type: 'info',
        }]);

        setLogsInScreen((prev) => [...prev, {
            message: `${second.getName()} has ${second.getResumedSkills()}`,
            type: 'info',
        }]);

        await sleep(1000);

        setLogsInScreen((prev) => [...prev, {
            message: `${first.getName()} is going to attack first`,
            type: 'info',
        }]);

        await sleep(1000);
    }

    const turn = async (attacker: Player, attacked: Player): Promise<void> => {
        const potions = attacker.getQuantity('Potion');
        if (potions > 0 && attacker.isDangerous()) {
            const heal = attacker.heal();
            attacker.increaseLife(heal);
            setLogsInScreen((prev) => [...prev, {
                message: `${attacker.getName()} heals ${heal} life and has ${potions - 1} potions left`,
                type: 'success',
            }]);
            await sleep(1000);
        }

        if (attacker.tryToHit(attacked)) {
            const damage = attacker.attack();
            const life = attacked.decreaseLife(damage);
            setLogsInScreen((prev) => [...prev, {
                message: `${attacker.getName()} hits ${attacked.getName()} with ${damage} damage, ${attacked.getName()} has ${life} life`,
                type: 'success',
            }]);

            await sleep(1000);
        } else {
            setLogsInScreen((prev) => [...prev, {
                message: `${attacker.getName()} misses ${attacked.getName()}`,
                type: 'warning',
            }]);

            await sleep(900);
        }
    }

    const verifyDead = (player: Player): boolean => {
        if (!player.isAlive()) {
            setLogsInScreen((prev) => [...prev, {
                message: `${player.getName()} is dead`,
                type: 'error',
            }]);
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
                        <div className="flex flex-col items-center mr-3 w-2/5">
                            <p className="text-2xl font-bold mb-1">{players[0].getName()}</p>
                            <LifeBar life={players[0].getLife() > 0 ? players[0].getLife() : 0} />
                        </div>
                        <div className="flex flex-col items-center ml-3 w-2/5">
                            <p className="text-2xl font-bold mb-1">{players[1].getName()}</p>
                            <LifeBar life={players[1].getLife() > 0 ? players[1].getLife() : 0} />
                        </div>
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

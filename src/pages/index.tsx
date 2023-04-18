import { Player } from "@/App/Player";
import { Battle } from "@/App/Battle";
import { useEffect, useState } from "react";
import { d100, d20 } from "@/functions/dices";

type Log = {
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

function LifeBar({ life }: { life: number }) {
    return (
        <div className="bg-gray-200 w-80 h-4 rounded-full">
            <div
                className="bg-green-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${life}%` }}
            >
            </div>
        </div>
    );
}

export default function Home() {
    const [logsInScreen, setLogsInScreen] = useState<Log[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    useEffect(() => {
        const Kazuma = new Player({
            name: "Kazuma",
            life: d100.roll(30, 80),
        }, {
            strength: d20.roll(10, 4),
            dexterity: d20.roll(-5, 4),
            charisma: d20.roll(-10, 4),
            constitution: d20.roll(5, 4),
            intelligence: d20.roll(0, 4),
            wisdom: d20.roll(0, 4),
        });

        const Megumin = new Player({
            name: "Megumin",
            life: d100.roll(20, 80),
        }, {
            strength: d20.roll(0, 4),
            dexterity: d20.roll(10, 4),
            charisma: d20.roll(10, 4),
            constitution: d20.roll(0, 4),
            intelligence: d20.roll(0, 4),
            wisdom: d20.roll(0, 4),
        });

        setPlayers([Kazuma, Megumin]);
    }, []);

    const startBattle = async () => {
        setLogsInScreen([]);
        const battle = new Battle(players[0], players[1]);
        const order = battle.getInitiative();

        if (order.length === 2) {
            const [first, second] = order;

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

            while (true) {
                if (first.tryToHit(second)) {
                    const damage = first.attack();
                    const life = second.decreaseLife(damage);
                    setLogsInScreen((prev) => [...prev, {
                        message: `${first.getName()} hits ${second.getName()} with ${damage} damage, ${second.getName()} has ${life} life`,
                        type: 'success',
                    }]);
                } else {
                    setLogsInScreen((prev) => [...prev, {
                        message: `${first.getName()} misses ${second.getName()}`,
                        type: 'warning',
                    }]);
                }

                if (!second.isAlive()) {
                    setLogsInScreen((prev) => [...prev, {
                        message: `${second.getName()} is dead`,
                        type: 'error',
                    }]);
                    break;
                }

                await sleep(1000);

                if (second.tryToHit(first)) {
                    const damage = second.attack();
                    const life = first.decreaseLife(damage);
                    setLogsInScreen((prev) => [...prev, {
                        message: `${second.getName()} hits ${first.getName()} with ${damage} damage, ${first.getName()} has ${life} life`,
                        type: 'success',
                    }]);
                } else {
                    setLogsInScreen((prev) => [...prev, {
                        message: `${second.getName()} misses ${first.getName()}`,
                        type: 'warning',
                    }]);
                }

                if (!first.isAlive()) {
                    setLogsInScreen((prev) => [...prev, {
                        message: `${first.getName()} is dead`,
                        type: 'error',
                    }]);
                    break;
                }

                await sleep(1000);
            }
        }

    }

    return (
        <main className="flex flex-col items-center py-2 mx-auto">
            <h1 className="text-4xl font-bold">Battle Simulator</h1>

            <button onClick={startBattle} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4">
                Start Battle
            </button>

            {
                players.length > 0 && (
                    <div className="flex flex-row items-center justify-center mb-4">
                        <div className="flex flex-col items-center mr-3">
                            <p className="text-2xl font-bold">{players[0].getName()}</p>
                            <LifeBar life={players[0].getLife() > 0 ? players[0].getLife() : 0} />
                        </div>
                        <div className="flex flex-col items-center ml-3">
                            <p className="text-2xl font-bold">{players[1].getName()}</p>
                            <LifeBar life={players[1].getLife() > 0 ? players[1].getLife() : 0} />
                        </div>
                    </div>
                )
            }

            <div className="flex flex-col items-center">
                {logsInScreen.map((log, index) => (
                    <p
                        key={index}
                        className="mb-2"
                    >
                        {log.message}
                    </p>
                ))}
            </div>
        </main>
);
}

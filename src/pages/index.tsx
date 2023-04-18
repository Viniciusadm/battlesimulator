import { Player } from "@/App/Player";
import { Battle } from "@/App/Battle";
import { useState } from "react";
import { d100, d20 } from "@/functions/dices";

export default function Home() {
    const [logsInScreen, setLogsInScreen] = useState<string[]>([]);

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const startBattle = async () => {
        setLogsInScreen([]);

        const Kazuma = new Player({
            name: "Kazuma",
            life: d100.roll(10, 50),
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
            life: d100.roll(0, 50),
        }, {
            strength: d20.roll(0, 4),
            dexterity: d20.roll(10, 4),
            charisma: d20.roll(10, 4),
            constitution: d20.roll(0, 4),
            intelligence: d20.roll(0, 4),
            wisdom: d20.roll(0, 4),
        });

        const battle = new Battle(Kazuma, Megumin);
        battle.fight();
        const logs = battle.getLogs();

        for (const log of logs) {
            setLogsInScreen((prev) => [...prev, log]);
            await sleep(1000);
        }
    }

    return (
        <main className="flex flex-col items-center py-2 mx-auto">
            <h1 className="text-4xl font-bold">Battle Simulator</h1>

            <button onClick={startBattle} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4">
                Start Battle
            </button>

            <div className="flex flex-col items-center">
                {logsInScreen.map((log, index) => (
                    <p
                        key={index}
                        className="mb-2"
                    >
                        {log}
                    </p>
                ))}
            </div>

        </main>
    );
}

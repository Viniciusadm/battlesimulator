import { useEffect, useState } from "react";
import Battle from "@/battlerpg/Classes/Battle";
import Player from "@/battlerpg/Classes/Player";
import { getSpell, Spell } from "@/battlerpg/Database/spells";
import { d20 } from "@/battlerpg/Helpers/dices";
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

function Toggle({ state, label, onChange }: { state: boolean, label: string, onChange: (value: boolean) => void }) {
    return (
        <label className="relative inline-flex items-center mb-5 cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" checked={state} onChange={(e) => onChange(e.target.checked)} />
                <div
                    className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"
                >
                </div>
                <span className="ml-3 text-sm font-medium text-gray-400 dark:text-gray-500">{ label }</span>
        </label>
    );
}

function Logs({logs}: {logs: Log[]}) {
    const getBackground = (type: Log['type']) => {
        switch (type) {
            case 'info':
                return 'bg-blue-200';
            case 'success':
                return 'bg-green-200';
            case 'warning':
                return 'bg-yellow-200';
            case 'error':
                return 'bg-red-200';
            default:
                return 'bg-gray-200';
        }
    }

    return (
        <div className="flex flex-col items-center">
            {logs.map((log, index) => (
                <p
                    key={index}
                    className={`mb-2 text-center ${getBackground(log.type)} p-2 rounded`}
                >
                    {log.message}
                </p>
            ))}
        </div>
    );
}

export default function Home() {
    const [logsInScreen, setLogsInScreen] = useState<Log[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [quickBattle, setQuickBattle] = useState<boolean>(false);

    const addLog = (message: string, type: Log['type'] = 'info') => {
        setLogsInScreen((prev) => [...prev, {
            message,
            type,
        }]);
    }

    const sleep = (ms: number) => new Promise(r => setTimeout(r, quickBattle ? ms / 0 : ms));

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

        const firebal = getSpell('Explosion');
        if (firebal) {
            Megumin.addSpell(firebal);
        }
        const heal = getSpell('Heal');
        if (heal) {
            Megumin.addSpell(heal);
        }

        Kazuma.setWatchArmor(12, true);

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
            addLog(`${attacker.getName()} heals ${heal} life and has ${potions - 1} potions left`, 'success');
            await sleep(1000);
        }
    }

    const attack = async (attacker: Player, attacked: Player) => {
        const attempt = attacker.tryToHit(attacked);
        if (attempt.success) {
            const attack = attacker.attack();
            const life = attacked.decreaseLife(attack.value);
            addLog(`${attacker.getName()} hits ${attacked.getName()} with ${attack.value} damage, ${attacked.getName()} has ${life} life`, 'success');
            await sleep(1000);
        } else {
            addLog(`${attacker.getName()} rolled a ${attempt.value} and missed`, 'warning');
            await sleep(900);
        }
    }

    const spell = async (attacker: Player, attacked: Player, spell: Spell) => {
        const resists = d20.roll().value;

        const attempt = attacker.useSpell(spell, resists);
        if (attempt) {
            const damage = (attempt as roll).value;
            const life = attacked.decreaseLife(damage);
            addLog(`${attacker.getName()} uses Explosion and hits ${attacked.getName()} with ${damage} damage, ${attacked.getName()} has ${life} life`, 'success');
        } else {
            addLog(`${attacker.getName()} tries to use Explosion but fails`, 'warning');
        }

        await sleep(1000);
    }

    const healSpell = async (attacker: Player, attacked: Player, spell: Spell) => {
        const attempt = attacker.useSpell(spell, 0);

        if (attempt) {
            const heal = (attempt as roll).value;
            const life = attacked.increaseLife(heal);

            if (attacker.getName() === attacked.getName()) {
                addLog(`${attacker.getName()} uses Heal and heals ${heal} life, ${attacker.getName()} has ${life} life`, 'success');
            } else {
                addLog(`${attacker.getName()} uses Heal and heals ${heal} life to ${attacked.getName()}, ${attacked.getName()} has ${life} life`, 'success');
            }
        }
    }

    const turn = async (attacker: Player, attacked: Player): Promise<void> => {
        await drinkPotion(attacker);

        if (attacker.canSpell('Heal') && attacker.isDangerous()) {
            await healSpell(attacker, attacker, getSpell('Heal') as Spell);
        } else {
            if (attacker.canSpell('Explosion')) {
                await spell(attacker, attacked, getSpell('Explosion') as Spell);
            } else {
                await attack(attacker, attacked);
            }
        }
    }

    const verifyDead = (player: Player): boolean => {
        if (!player.isAlive()) {
            addLog(`${player.getName()} is dead`, 'error');
            return true;
        }

        return false;
    }

    const startBattle = async () => {
        players.forEach((player) => {
            player.setInventory('Potion', 3);
        });

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

            <Toggle state={quickBattle} onChange={setQuickBattle} label="Quick Battle" />

            {
                players.length > 0 && (
                    <div className="flex flex-row items-center justify-center mb-4 w-full">
                        <PlayerStatus player={players[0]} />
                        <PlayerStatus player={players[1]} />
                    </div>
                )
            }

            <Logs logs={logsInScreen} />
        </main>
    );
}

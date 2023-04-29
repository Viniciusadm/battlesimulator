import { useState } from "react";
import Battle from "@/battlerpg/Classes/Battle";
import Player from "@/battlerpg/Classes/Player";
import { d20, d6, d8 } from "@/battlerpg/Helpers/dices";
import Dice, { roll } from "@/battlerpg/Classes/Dice";
import { CreateSpellData, Spell } from "@/pages/spells";
import PlayerStatus from "@/components/battle/PlayerStatus";
import Toggle from "@/components/utils/Toggle";
import Logs, { Log } from "@/components/battle/Logs";
import { CreatePlayerData } from "@/pages/players";
import api from "@/services/api";
import { spells_type } from "@/pages/spells";

type Props = {
    players_selectables: CreatePlayerData[];
    spells_selectables: CreateSpellData[];
}

export default function Home({ players_selectables, spells_selectables }: Props) {
    const [logsInScreen, setLogsInScreen] = useState<Log[]>([]);
    const [quickBattle, setQuickBattle] = useState<boolean>(false);
    const [victories, setVictories] = useState<{player1: number, player2: number}>({player1: 0, player2: 0});
    const [multiplesBattles, setMultiplesBattles] = useState<boolean>(false);
    const [battles, setBattles] = useState<number>(0);
    const [victtoriesWithInitiative, setVicttoriesWithInitiative] = useState<number>(0);
    const [ready, setReady] = useState<boolean>(false);
    const [players, setPlayers] = useState<{player1?: number, player2?: number}>({player1: undefined, player2: undefined});
    const [warriors, setWarriors] = useState<{player1?: Player, player2?: Player}>({player1: undefined, player2: undefined});

    const spells: Spell[] = spells_selectables.map((spell: CreateSpellData) => {
        return {
            ...spell,
            id: spell.id as number,
            type: spell.type as spells_type,
            dices: Dice.parseDiceString(spell.dices),
        }
    });

    console.log(spells);

    const changePlayer = (player: 'player1' | 'player2', id: number) => {
        setPlayers((prev) => ({
            ...prev,
            [player]: id,
        }));
    }

    const addLog = (message: string, type: Log['type'] = 'info') => {
        if (multiplesBattles) {
            return;
        }

        setLogsInScreen((prev) => [...prev, {
            message,
            type,
        }]);
    }

    const sleep = (ms: number) => new Promise(r => setTimeout(r, quickBattle ? ms / 0 : ms));

    const setItems = () => {
        warriors.player1?.setWatchArmor(12, true);
        warriors.player1?.setWatchWeapon(d8, 'melee');
        warriors.player2?.setWatchWeapon(d6, 'range');
    }

    const initialLogs = async (first: Player, second: Player) => {
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

    const receiveEnergy = async (attacker: Player) => {
        const value = d6.roll(attacker.getExpecifiedSkill('intelligence')).value;
        attacker.increaseEnergy(value);
        addLog(`${attacker.getName()} receives ${value} energy`, 'success');
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

    const getSpell = (name: string): Spell | undefined => {
        return spells.find((spell) => spell.name === name);
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

            if (player.getName() === warriors.player1?.getName()) {
                setVictories((prev) => ({...prev, player2: prev.player2 + 1}));
            } else {
                setVictories((prev) => ({...prev, player1: prev.player1 + 1}));
            }

            return true;
        }

        return false;
    }

    const changeMultiple = (value: boolean) => {
        setMultiplesBattles(value);

        if (value) {
            setQuickBattle(true);
        }
    }

    const changeQuickBattle = (value: boolean) => {
        if (multiplesBattles) {
            setQuickBattle(true);
        } else {
            setQuickBattle(value);
        }
    }

    const setWarriorsInBatle = () => {
        const data1 = players_selectables.find((item) => item.id === players.player1);
        const data2 = players_selectables.find((item) => item.id === players.player2);

        if (!data1 || !data2) {
            return;
        }

        const player1 = new Player({
            name: data1.name,
        }, {
            strength: data1.strength,
            intelligence: data1.intelligence,
            wisdom: data1.wisdom,
            dexterity: data1.dexterity,
            charisma: data1.charisma,
            constitution: data1.constitution,
        });

        if (data1.player_spells) {
            data1.player_spells.map((spell) => {
                const spellData = spells.find((item) => item.id === spell);
                if (spellData) {
                    player1.addSpell(spellData);
                }
            });
        }

        const player2 = new Player({
            name: data2.name,
        }, {
            strength: data2.strength,
            intelligence: data2.intelligence,
            wisdom: data2.wisdom,
            dexterity: data2.dexterity,
            charisma: data2.charisma,
            constitution: data2.constitution,
        });

        if (data2.player_spells) {
            data2.player_spells.map((spell) => {
                const spellData = spells.find((item) => item.id === spell);
                if (spellData) {
                    player2.addSpell(spellData);
                }
            });
        }

        setWarriors({player1, player2});
        setReady(true);
    }

    const startBattle = async () => {
        if (!warriors.player1 || !warriors.player2) {
            return;
        }

        setItems();

        setLogsInScreen([]);
        const battle = new Battle(warriors.player1, warriors.player2);
        const battles = multiplesBattles ? 100 : 1;

        for (let i = 0; i < battles; i++) {
            setBattles((prev) => prev + 1);
            const order = battle.getInitiative();

            const [first, second] = order;

            first.setInventory('Potion', 3);
            second.setInventory('Potion', 3);

            await initialLogs(first, second);

            let contage = 0;

            while (true) {
                if (contage % 4 === 0) {
                    if (first.getEnergy() !== first.getMaxEnergy()) {
                        await receiveEnergy(first);
                    }

                    if (second.getEnergy() !== second.getMaxEnergy()) {
                        await receiveEnergy(second);
                    }
                }

                await turn(first, second);

                if (verifyDead(second)) {
                    setVicttoriesWithInitiative((prev) => prev + 1);
                    break;
                }

                await turn(second, first);

                if (verifyDead(first)) {
                    break;
                }

                contage++;
            }
        }
    }

    const clearVictories = () => {
        setVictories({player1: 0, player2: 0});
        setVicttoriesWithInitiative(0);
        setBattles(0);
    }

    const classNames = ready ? 'w-full lg:w-1/4 h-fit lg:h-full' : 'w-full h-full';

    return (
        <main className="flex flex-col lg:flex-row h-screen max-h-screen">
            <div
                className={`flex flex-col items-center justify-center bg-gray-200 pt-4 lg:p-4 border-r-2 border-gray-400 ${classNames}`}>
                <h1 className="text-3xl lg:text-4xl text-center font-bold mb-3">
                    Battle Simulator
                </h1>

                <div className="mb-3">
                    <button
                        onClick={startBattle}
                        disabled={!players.player1 && !players.player2}
                        className={`text-white font-bold py-2 px-4 rounded my-4 ${players.player1 && players.player2 ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500'}`}
                    >
                        Start Battle
                    </button>
                    <button onClick={clearVictories} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-4 ml-1">
                        Clear
                    </button>
                </div>

                <div className="flex flex-col justify-center mb-3">
                    <Toggle state={multiplesBattles} onChange={changeMultiple} label="Multiples Battles" />
                    <Toggle state={quickBattle} onChange={changeQuickBattle} label="Quick Battle" />
                </div>

                <div className="flex flex-col justify-center mb-3">
                    <p className="text-2xl font-bold">
                        General Data
                    </p>
                    <p>
                        Battles: {battles}
                        <br />
                        Victories with initiative: {victtoriesWithInitiative} ({(victtoriesWithInitiative / battles * 100).toFixed(2)}%)
                    </p>
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="player1">
                        Player 1
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="player1"
                        value={players.player1}
                        onChange={(e) => changePlayer('player1', parseInt(e.target.value))}
                    >
                        <option value="">Select a player</option>
                        {players_selectables.map((player) => (
                            <option key={player.id} value={player.id}>
                                {player.name}
                            </option>
                        ))}
                    </select>

                    <label className="block text-gray-700 text-sm font-bold mb-2 mt-4" htmlFor="player2">
                        Player 2
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="player2"
                        value={players.player2}
                        onChange={(e) => changePlayer('player2', parseInt(e.target.value))}
                    >
                        <option value="">Select a player</option>
                        {players_selectables.map((player) => (
                            <option key={player.id} value={player.id}>
                                {player.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={setWarriorsInBatle}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
                        disabled={!players.player1 && !players.player2}
                    >
                        Set
                    </button>
                </div>
            </div>

            {ready && warriors.player1 && warriors.player2 && (
                <div className="flex flex-col bg-gray-200 lg:p-4 w-full lg:w-3/4 h-full">
                    {
                        <div className="flex flex-row justify-center lg:h-1/4 mb-3">
                            <PlayerStatus player={warriors.player1} victory={victories.player1} />
                            <PlayerStatus player={warriors.player2} victory={victories.player2} />
                        </div>
                    }

                    <div className="flex flex-col items-center overflow-y-auto w-full lg:h-3/4 px-4 lg:px-0">
                        <Logs logs={logsInScreen} />
                    </div>
                </div>
            )}
        </main>
    );
}

export async function getServerSideProps() {
    const res = await api.get('/players');
    const response = await api.get('/spells');

    return {
        props: {
            players_selectables: res.data || [],
            spells_selectables: response.data || [],
        },
    }
}
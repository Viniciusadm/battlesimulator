import { useState } from "react";
import Input from "@/components/Input";
import supabase from "@/services/supabase";
import { enqueueSnackbar } from "notistack";

export type PlayerResponse = {
    id?: string;
    name: string;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
}

export default function Players({ players }: { players: PlayerResponse[] }) {
    const [player, setPlayer] = useState<PlayerResponse>({
        name: '',
        charisma: 0,
        constitution: 0,
        dexterity: 0,
        wisdom: 0,
        strength: 0,
        intelligence: 0,
    } as PlayerResponse);

    const [playersState, setPlayersState] = useState<PlayerResponse[]>(players);

    const handleAddPlayer = async () => {
        const { data, error } = await supabase
            .from('players')
            .insert(player)
            .select()

        if (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
            return;
        }

        setPlayer({
            name: '',
            charisma: 0,
            constitution: 0,
            dexterity: 0,
            wisdom: 0,
            strength: 0,
            intelligence: 0,
        } as PlayerResponse)

        enqueueSnackbar('Player added!', { variant: 'success' })
        setPlayersState([...playersState, data[0] as PlayerResponse]);
    }

    return (
        <main className="flex flex-col w-full flex-1 px-20">
            <h1 className="text-4xl font-bold my-4">
                Players
            </h1>
            <div className="flex flex-col">
                <Input
                    label="Name"
                    name="name"
                    value={player.name}
                    onChange={(value) => setPlayer({ ...player, name: value as string })}
                />
                <Input
                    label="Strength"
                    name="strength"
                    value={player.strength}
                    onChange={(value) => setPlayer({ ...player, strength: value as number })}
                    type="number"
                />
                <Input
                    label="Dexterity"
                    name="dexterity"
                    value={player.dexterity}
                    onChange={(value) => setPlayer({ ...player, dexterity: value as number })}
                    type="number"
                />
                <Input
                    label="Constitution"
                    name="constitution"
                    value={player.constitution}
                    onChange={(value) => setPlayer({ ...player, constitution: value as number })}
                    type="number"
                />
                <Input
                    label="Intelligence"
                    name="intelligence"
                    value={player.intelligence}
                    onChange={(value) => setPlayer({ ...player, intelligence: value as number })}
                    type="number"
                />
                <Input
                    label="Wisdom"
                    name="wisdom"
                    value={player.wisdom}
                    onChange={(value) => setPlayer({ ...player, wisdom: value as number })}
                    type="number"
                />
                <button
                    className="bg-black text-white rounded px-4 py-2"
                    onClick={handleAddPlayer}
                >
                    Add Player
                </button>
            </div>

            <div className="flex flex-col mt-4">
                {playersState.map((player) => (
                    <div key={player.id} className="flex flex-col">
                        <h2 className="text-2xl font-bold">{player.name}</h2>
                        <ul className="flex flex-col">
                            <li>Strength: {player.strength}</li>
                            <li>Dexterity: {player.dexterity}</li>
                            <li>Constitution: {player.constitution}</li>
                            <li>Intelligence: {player.intelligence}</li>
                            <li>Wisdom: {player.wisdom}</li>
                        </ul>
                    </div>
                ))}
            </div>
        </main>
    )
}

export async function getServerSideProps() {
    let { data } = await supabase.from('players').select()

    return {
        props: {
            players: data
        },
    }
}
import { useState } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import supabase from "@/services/supabase";
import Dice from "@/battlerpg/Classes/Dice";
import { enqueueSnackbar } from "notistack";

export type Spell = {
    id?: string;
    name: string;
    energy_cost: number;
    dices: Dice[];
    type: 'attack' | 'heal';
};

export type SpellResponse = {
    id?: string;
    name: string;
    energy_cost: number;
    dices: number[];
    type: 'attack' | 'heal';
}

export default function Spells({ spells }: { spells: SpellResponse[] }) {
    const [spell, setSpell] = useState<SpellResponse>({
        name: '',
        energy_cost: 0,
        dices: [],
        type: 'attack',
    } as SpellResponse);

    const [spellsState, setSpellsState] = useState<SpellResponse[]>(spells);

    const handleAddSpell = async () => {
        const payload = {
            ...spell,
            dices: spell.dices.map((dice) => parseInt(dice as unknown as string)),
        }

        const { data, error } = await supabase
            .from('spells')
            .insert(payload)
            .select()

        if (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
            return;
        }

        setSpell({
            name: '',
            energy_cost: 0,
            dices: [],
            type: 'attack',
        } as SpellResponse)

        enqueueSnackbar('Spell added!', { variant: 'success' })
        setSpellsState([...spellsState, data[0] as SpellResponse]);
    }

    return (
        <main className="flex flex-col w-full flex-1 px-20">
            <h1 className="text-4xl font-bold my-4">
                Spells
            </h1>
            <div className="flex flex-col">
                <Input
                    label="Name"
                    name="name"
                    value={spell.name}
                    onChange={(value) => setSpell({ ...spell, name: value as string })}
                />
                <Input
                    label="Energy Cost"
                    name="energy"
                    value={spell.energy_cost}
                    onChange={(value) => setSpell({ ...spell, energy_cost: value as number })}
                />
                <Select
                    label="Type"
                    value={spell.type}
                    name="type"
                    onChange={(value) => setSpell({ ...spell, type: value as 'attack' | 'heal' })}
                >
                    <option value="attack">Attack</option>
                    <option value="heal">Heal</option>
                </Select>

                <Checkbox
                    label="Dices"
                    name="dices"
                    value={spell.dices as []}
                    onChange={(value) => setSpell({ ...spell, dices: value as [] })}
                    values={[
                        { id: 'd4', value: 4, label: 'd4' },
                        { id: 'd6', value: 6, label: 'd6' },
                        { id: 'd8', value: 8, label: 'd8' },
                        { id: 'd10', value: 10, label: 'd10' },
                        { id: 'd12', value: 12, label: 'd12' },
                    ]}
                />

                <button
                    className="bg-black text-white rounded px-4 py-2"
                    onClick={handleAddSpell}
                >
                    Add Spell
                </button>
            </div>

            <div className="flex flex-col mt-4">
                {spellsState.map((spell) => (
                    <div key={spell.id} className="flex flex-col">
                        <h2 className="text-2xl font-bold">{spell.name}</h2>
                        <p>Energy Cost: {spell.energy_cost}</p>
                        <p>Type: {spell.type}</p>
                        <p>Dices: {spell.dices?.join(', ')}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}

export async function getServerSideProps() {
    let { data } = await supabase.from('spells').select()

    return {
        props: {
            spells: data
        },
    }
}
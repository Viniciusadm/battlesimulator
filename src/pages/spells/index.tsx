import { useState } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import { Spell } from "@/contexts/ItemsContext";
import supabase from "@/services/supabase";

export default function Spells({ spells }: { spells: Spell[] }) {
    const [spell, setSpell] = useState<Spell>({} as Spell);

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
                    value={spell.energyCost}
                    onChange={(value) => setSpell({ ...spell, energyCost: value as number })}
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
                >
                    Add Spell
                </button>
            </div>

            <div className="flex flex-col mt-4">
                {spells.map((spell) => (
                    <div key={spell.id} className="flex flex-col">
                        <h2 className="text-2xl font-bold">{spell.name}</h2>
                        <p>Energy Cost: {spell.energyCost}</p>
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
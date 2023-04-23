import { useState } from "react";
import supabase from "@/services/supabase";
import { enqueueSnackbar } from "notistack";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "@/components/Form";
import Dice from "@/battlerpg/Classes/Dice";

export type Spell = {
    id?: string;
    name: string;
    energy_cost: number;
    dices: Dice[];
    type: 'attack' | 'heal';
};

const createSpellSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    energy_cost: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(1).max(20)
    ),
    dices: z.preprocess(
        (a) => z.string().parse(a).split(',').map((dice) => parseInt(dice, 10)),
        z.array(z.number().positive().min(4).max(12))
    ),
    type: z.enum(['attack', 'heal']),
})

type CreateSpellData = z.infer<typeof createSpellSchema>

export default function Spells({ spells }: { spells: CreateSpellData[] }) {
    const createSpellForm = useForm<CreateSpellData>({
        resolver: zodResolver(createSpellSchema),
    })

    const [spellsState, setSpellsState] = useState<CreateSpellData[]>(spells);

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = createSpellForm;

    const handleAddSpell = async (data: CreateSpellData) => {
        const { data: SpellData, error } = await supabase
            .from('spells')
            .insert(data)
            .select()

        if (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
            return;
        }

        enqueueSnackbar('Spell added!', { variant: 'success' })
        setSpellsState([...spellsState, SpellData[0] as CreateSpellData]);
    }

    return (
        <main className="flex flex-col w-full flex-1 px-20 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold my-4">
                Spells
            </h1>

            <FormProvider {...createSpellForm}>
                <form
                    onSubmit={handleSubmit(handleAddSpell)}
                    className="flex flex-col gap-4 w-full"
                >
                    <Form.Field>
                        <Form.Label htmlFor="name">
                            Name
                        </Form.Label>
                        <Form.Input type="name" name="name" />
                        <Form.ErrorMessage field="name" />
                    </Form.Field>

                    <Form.Field>
                        <Form.Label htmlFor="energy_cost">
                            Energy Cost
                        </Form.Label>
                        <Form.Input type="number" name="energy_cost" />
                        <Form.ErrorMessage field="energy_cost" />
                    </Form.Field>

                    <Form.Field>
                        <Form.Label htmlFor="type">
                            Type
                        </Form.Label>
                        <Form.Select name="type">
                            <option value="attack">Attack</option>
                            <option value="heal">Heal</option>
                        </Form.Select>
                        <Form.ErrorMessage field="type" />
                    </Form.Field>

                    <Form.Field>
                        <Form.Label htmlFor="dices">
                            Dices
                        </Form.Label>
                        <Form.Input name="dices" />
                        <Form.ErrorMessage field="dices" />
                    </Form.Field>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-violet-500 text-white rounded px-3 h-10 font-semibold text-sm hover:bg-violet-600"
                    >
                        Salvar
                    </button>
                </form>
            </FormProvider>


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
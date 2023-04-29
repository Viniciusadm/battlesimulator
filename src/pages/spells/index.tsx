import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "@/components/Form";
import api from "@/services/api";
import { TypeDice } from "@/utils";

export enum spells_type {
    heal = 'heal',
    damage = 'damage',
}

export type Spell = {
    id: number;
    name: string;
    energy_cost: number;
    dices: TypeDice[];
    type: spells_type;
};

const createSpellSchema = z.object({
    id: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(1)
    ).optional(),
    name: z.string(),
    energy_cost: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(1).max(20)
    ),
    dices: z.string().regex(/^\d+d(4|6|8|10|12|20)(\+\d+)?$/),
    type: z.enum(['heal', 'damage']),
})

export type CreateSpellData = z.infer<typeof createSpellSchema>

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
        const SpellData = await api.post('/spells/create', data);

        if (SpellData.status !== 201) {
            return enqueueSnackbar('Error on create spell', { variant: 'error' })
        }

        setSpellsState([...spellsState, SpellData.data]);

        enqueueSnackbar('Spell added!', { variant: 'success' })
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
                            <option value="damage">Damage</option>
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
                        <p>Dices: {spell.dices}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}

export async function getServerSideProps() {
    const res = await api.get('/spells');

    return {
        props: {
            spells: res.data || [],
        },
    }
}
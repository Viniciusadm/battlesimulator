import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "@/components/Form";
import api from "@/services/api";

const createArmorSchema = z.object({
    id: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(1)
    ).optional(),
    name: z.string().min(3).max(255),
    type: z.literal('armor'),
    base: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(10).max(20)
    ),
    additional: z.boolean(),
})

type Armor = {
    id: number;
    name: string;
}

export type CreateArmorData = z.infer<typeof createArmorSchema>

export default function Armors({ armors }: { armors: CreateArmorData[] }) {
    const createArmorForm = useForm<CreateArmorData>({
        resolver: zodResolver(createArmorSchema),
        defaultValues: {
            type: 'armor',
            base: 10,
            additional: true,
        }
    })

    const [armorsState, setArmorsState] = useState<CreateArmorData[]>(armors);

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset,
    } = createArmorForm;

    const handleAddArmor = async (data: CreateArmorData) => {
        const ArmorData = await api.post('/armors/create', data);

        if (ArmorData.status !== 201) {
            return enqueueSnackbar('Error on create armor', { variant: 'error' })
        }

        setArmorsState([...armorsState, ArmorData.data]);

        enqueueSnackbar('Armor added!', { variant: 'success' })
        reset();
    }

    return (
        <main className="flex flex-col w-full flex-1 px-20 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold my-4">
                Armors
            </h1>

            <FormProvider {...createArmorForm}>
                <form
                    onSubmit={handleSubmit(handleAddArmor)}
                    className="flex flex-col gap-4 w-full"
                >
                    <Form.Field>
                        <Form.Label htmlFor="name">
                            Name
                        </Form.Label>
                        <Form.Input type="name" name="name" />
                        <Form.ErrorMessage field="name" />
                    </Form.Field>

                    <Form.Input name="type" type="hidden" value="armor" />

                    <Form.Field>
                        <Form.Label htmlFor="base">
                            Base
                        </Form.Label>
                        <Form.Input type="number" name="base" />
                        <Form.ErrorMessage field="base" />
                    </Form.Field>

                    <Form.Field>
                        <Form.Label htmlFor="additional">
                            Additional
                        </Form.Label>
                        <Form.Toggle name="additional" />
                        <Form.ErrorMessage field="additional" />
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
                {armorsState.map((armor) => (
                    <div key={armor.id} className="flex flex-col">
                        <h2 className="text-2xl font-bold">{armor.name}</h2>
                        <p className="text-sm text-gray-500">Base: {armor.base}</p>
                        <p className="text-sm text-gray-500">Additional: {armor.additional ? 'Yes' : 'No'}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}

export async function getServerSideProps() {
    const res = await api.get('/armors');

    return {
        props: {
            armors: res.data || [],
        },
    }
}
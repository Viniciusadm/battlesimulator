import { useState } from "react";
import supabase from "@/services/supabase";
import { enqueueSnackbar } from "notistack";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "@/components/Form";
import Dice from "@/battlerpg/Classes/Dice";
import api from "@/services/api";

export type Item = {
    id: number;
    name: string;
    type: 'weapon' | 'armor' | 'potion' | 'item';
    target: 'self' | 'enemy' | 'ally';
    dices: Dice[];
};

const createItemSchema = z.object({
    id: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(1)
    ).optional(),
    name: z.string(),
    type: z.enum(['weapon', 'armor', 'potion', 'item']),
    target: z.enum(['self', 'enemy', 'ally']),
    dices: z.preprocess(
        (a) => z.string().parse(a).split(',').map((dice) => parseInt(dice, 10)),
        z.array(z.number().positive().min(4).max(12))
    ),
})

export type CreateItemData = z.infer<typeof createItemSchema>

export default function Items({ items }: { items: CreateItemData[] }) {
    const createItemForm = useForm<CreateItemData>({
        resolver: zodResolver(createItemSchema),
    })

    const [itemsState, setItemsState] = useState<CreateItemData[]>(items);

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = createItemForm;

    const handleAddItem = async (data: CreateItemData) => {
        const { data: ItemData, error } = await supabase
            .from('items')
            .insert(data)
            .select()

        if (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
            return;
        }

        enqueueSnackbar('Item added!', { variant: 'success' })
        setItemsState([...itemsState, ItemData[0] as CreateItemData]);
    }

    return (
        <main className="flex flex-col w-full flex-1 px-20 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold my-4">
                Items
            </h1>

            <FormProvider {...createItemForm}>
                <form
                    onSubmit={handleSubmit(handleAddItem)}
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
                        <Form.Label htmlFor="type">
                            Type
                        </Form.Label>
                        <Form.Select name="type">
                            <option value="armor">Armor</option>
                            <option value="item">Item</option>
                            <option value="potion">Potion</option>
                            <option value="weapon">Weapon</option>
                        </Form.Select>
                        <Form.ErrorMessage field="type" />
                    </Form.Field>

                    <Form.Field>
                        <Form.Label htmlFor="target">
                            Target
                        </Form.Label>
                        <Form.Select name="target">
                            <option value="ally">Ally</option>
                            <option value="enemy">Enemy</option>
                            <option value="self">Self</option>
                        </Form.Select>
                        <Form.ErrorMessage field="target" />
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
                {itemsState.map((item) => (
                    <div key={item.id} className="flex flex-col">
                        <h2 className="text-2xl font-bold">{item.name}</h2>
                        <p>Type: {item.type}</p>
                        <p>Target: {item.target}</p>
                        <p>Dices: {item.dices?.join(', ')}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}

export async function getServerSideProps() {
    const res = await api.get('/items');

    return {
        props: {
            items: res.data || [],
        },
    }
}
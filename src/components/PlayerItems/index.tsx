import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/api";
import { enqueueSnackbar } from "notistack";
import { z } from "zod";
import { CreatePlayerData } from "@/pages/players";
import { Form } from "@/components/Form";
import { CreateArmorData } from "@/pages/armors";

const createPlayerItemsSchema = z.object({
    armor: z.preprocess(
        (a) => {
            if (a) {
                return parseInt(z.string().parse(a), 10);
            } else {
                return null;
            }
        },
        z.number().positive().nullable()
    ),
});

type CreatePlayerItemsData = z.infer<typeof createPlayerItemsSchema>;

type Props = {
    player: CreatePlayerData,
    armors: CreateArmorData[],
}

export default function PlayerItems({ player, armors }: Props) {
    const createPlayerItemsForm = useForm<CreatePlayerItemsData>({
        resolver: zodResolver(createPlayerItemsSchema),
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = createPlayerItemsForm;

    const handleAddItems = async (data: CreatePlayerItemsData) => {
        const ItemsData = await api.post(`/players/items/${player.id}`, data);

        if (ItemsData.status !== 201) {
            return enqueueSnackbar('Error on add items', { variant: 'error' })
        }

        enqueueSnackbar('Items added!', { variant: 'success' })
    }

    return (
        <FormProvider {...createPlayerItemsForm}>
            <form
                onSubmit={handleSubmit(handleAddItems)}
            >
                <h2 className="text-2xl font-bold mb-3">
                    Armor
                </h2>

                <Form.Field className="mb-2">
                    <Form.Label htmlFor="armor">Armor</Form.Label>
                    <Form.Select
                        id="armor"
                        name="armor"
                    >
                        <option value="">Select a armor</option>
                        {armors.map((armor) => (
                            <option key={armor.id} value={armor.id}>
                                {armor.name} ({armor.base} {armor.additional ? '+ dex' : ''})
                            </option>
                        ))}
                    </Form.Select>
                    <Form.ErrorMessage field="armor" />
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
    )
}
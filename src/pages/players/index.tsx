import { useState } from "react";
import supabase from "@/services/supabase";
import { enqueueSnackbar } from "notistack";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "@/components/Form";
import api from "@/services/api";

const createPlayerSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    strength: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(8).max(15)
    ),
    dexterity: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(8).max(15)
    ),
    constitution: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(8).max(15)
    ),
    intelligence: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(8).max(15)
    ),
    wisdom: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(8).max(15)
    ),
    charisma: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().min(8).max(15)
    ),
    player_spells: z.array(z.number()).optional(),
    player_items: z.array(z.number()).optional(),
})

export type CreatePlayerData = z.infer<typeof createPlayerSchema>

export default function Players({ players }: { players: CreatePlayerData[] }) {
    const createPlayerForm = useForm<CreatePlayerData>({
        resolver: zodResolver(createPlayerSchema),
    })

    const [playersState, setPlayersState] = useState<CreatePlayerData[]>(players);

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = createPlayerForm;

    const handleAddPlayer = async (data: CreatePlayerData) => {
        const { data: PlayerData, error } = await supabase
            .from('players')
            .insert(data)
            .select()

        if (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
            return;
        }

        enqueueSnackbar('Player added!', { variant: 'success' })
        setPlayersState([...playersState, PlayerData[0] as CreatePlayerData]);
    }

    return (
        <main className="flex flex-col w-full flex-1 px-20 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold my-4">
                Players
            </h1>

            <FormProvider {...createPlayerForm}>
                <form
                    onSubmit={handleSubmit(handleAddPlayer)}
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
                        <Form.Label htmlFor="strength">
                            Strength
                        </Form.Label>
                        <Form.Input type="number" name="strength" />
                        <Form.ErrorMessage field="strength" />
                    </Form.Field>

                    <Form.Field>
                        <Form.Label htmlFor="dexterity">
                            Dexterity
                        </Form.Label>
                        <Form.Input type="number" name="dexterity" />
                        <Form.ErrorMessage field="dexterity" />
                    </Form.Field>

                    <Form.Field>
                        <Form.Label htmlFor="constitution">
                            Constitution
                        </Form.Label>
                        <Form.Input type="number" name="constitution" />
                        <Form.ErrorMessage field="constitution" />
                    </Form.Field>

                    <Form.Field>
                        <Form.Label htmlFor="intelligence">
                            Intelligence
                        </Form.Label>
                        <Form.Input type="number" name="intelligence" />
                        <Form.ErrorMessage field="intelligence" />
                    </Form.Field>

                    <Form.Field>
                        <Form.Label htmlFor="wisdom">
                            Wisdom
                        </Form.Label>
                        <Form.Input type="number" name="wisdom" />
                        <Form.ErrorMessage field="wisdom" />
                    </Form.Field>

                    <Form.Field>
                        <Form.Label htmlFor="charisma">
                            Charisma
                        </Form.Label>
                        <Form.Input type="number" name="charisma" />
                        <Form.ErrorMessage field="charisma" />
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


            <div className="flex flex-col my-4">
                {playersState.map((player) => (
                    <div key={player.id} className="flex flex-col">
                        <h2 className="text-2xl font-bold">{player.name}</h2>
                        <ul className="flex flex-col">
                            <li>Strength: {player.strength}</li>
                            <li>Dexterity: {player.dexterity}</li>
                            <li>Constitution: {player.constitution}</li>
                            <li>Intelligence: {player.intelligence}</li>
                            <li>Wisdom: {player.wisdom}</li>
                            <li>Charisma: {player.charisma}</li>
                        </ul>
                    </div>
                ))}
            </div>
        </main>
    )
}

export async function getServerSideProps() {
    const res = await api.get('/players');

    return {
        props: {
            players: res.data || [],
        },
    }
}
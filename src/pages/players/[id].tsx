import { NextPageContext } from 'next';
import { enqueueSnackbar } from "notistack";
import { CreatePlayerData } from "@/pages/players/index";
import { CreateSpellData } from "@/pages/spells";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/Form";
import api from "@/services/api";

const createPlayerSpellsSchema = z.object({
    spells: z.preprocess(
        (a) => {
            if (Array.isArray(a)) {
                return a.map((id) => parseInt(id, 10));
            } else {
                return [];
            }
        },
        z.array(z.number())
    ),
});

type CreatePlayerSpellsData = z.infer<typeof createPlayerSpellsSchema>;

type Props = {
    player: CreatePlayerData,
    spells: CreateSpellData[],
};

export default function Player({ player, spells }: Props) {
    const createPlayerSpellsForm = useForm<CreatePlayerSpellsData>({
        resolver: zodResolver(createPlayerSpellsSchema),
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = createPlayerSpellsForm;

    const handleAddSpells = async (data: CreatePlayerSpellsData) => {
        const SpellsData = await api.post(`/players/spells/${player.id}`, data);

        if (SpellsData.status !== 201) {
            return enqueueSnackbar('Error on add spells', { variant: 'error' })
        }

        enqueueSnackbar('Spells added!', { variant: 'success' })
    }

    return (
        <main className="flex flex-col flex-1 px-20 max-w-7xl mx-auto w-full">
            <div className="mb-4">
                <h1 className="text-4xl font-bold my-4">
                    Player: {player.name}
                </h1>
                <ul className="flex flex-col">
                    <li>Strength: {player.strength}</li>
                    <li>Dexterity: {player.dexterity}</li>
                    <li>Constitution: {player.constitution}</li>
                    <li>Intelligence: {player.intelligence}</li>
                    <li>Wisdom: {player.wisdom}</li>
                    <li>Charisma: {player.charisma}</li>
                </ul>
            </div>

            <FormProvider {...createPlayerSpellsForm}>
                <form
                    onSubmit={handleSubmit(handleAddSpells)}
                >
                    <h2 className="text-2xl font-bold mb-3">
                        Spells
                    </h2>
                    {
                        spells.map(spell => (
                            <Form.Field key={spell.id} className="mb-2">
                                <div className="flex items-center">
                                    <Form.Input
                                        id={`spell_${spell.id}`}
                                        type="checkbox"
                                        name="spells[]"
                                        value={spell.id}
                                        className="w-5 h-5 mr-2"
                                        defaultChecked={player.player_spells?.includes(spell.id as number)}
                                    />
                                    <Form.Label htmlFor={`spell_${spell.id}`}>
                                        {spell.name}
                                    </Form.Label>
                                </div>
                                <Form.ErrorMessage field="spells" />
                            </Form.Field>
                        ))
                    }

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-violet-500 text-white rounded px-3 h-10 font-semibold text-sm hover:bg-violet-600"
                    >
                        Salvar
                    </button>
                </form>
            </FormProvider>
        </main>
    );
}

export async function getServerSideProps(context: NextPageContext) {
    const { id } = context.query;
    const player = await api.get(`/players/${id}`);

    if (!player) {
        return {
            notFound: true
        }
    }

    const spells = await api.get('/spells');

    return {
        props: {
            player: player.data,
            spells: spells.data,
        }
    }
}
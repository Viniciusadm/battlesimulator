import { NextPageContext } from 'next';
import { PlayerResponse } from "@/pages/players";
import { SpellResponse } from "@/pages/spells";
import supabase from "@/services/supabase";
import Checkbox from "@/components/Checkbox";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";

export default function Player({ player, spells }: { player: PlayerResponse, spells: SpellResponse[] }) {
    const [spellsState, setSpellsState] = useState<SpellResponse[]>(spells);
    const [playerSpells, setPlayerSpells] = useState<string[]>([]);

    const handleAddSpells = async () => {
        await supabase
            .from('player_spells')
            .delete()
            .match({ player_id: player.id });

        const { data, error } = await supabase
            .from('player_spells')
            .insert(playerSpells.map(spell => {
                return {
                    player_id: player.id,
                    spell_id: spell,
                }
            }))
            .select()

        if (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
            return;
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

            <form>
                <Checkbox
                    label="Spells"
                    name="player_spells"
                    value={playerSpells as []}
                    onChange={(value) => setPlayerSpells(value as [])}
                    values={spellsState.map(spell => {
                        return {
                            label: spell.name as string,
                            value: spell.id as string,
                            id: spell.id as string,
                        }
                    })}
                />

                <button
                    className="bg-black text-white rounded px-4 py-2"
                    onClick={handleAddSpells}
                    type="button"
                >
                    Add Spells
                </button>
            </form>
        </main>
    );
}

export async function getServerSideProps(context: NextPageContext) {
    const { id } = context.query;
    const { data: player } = await supabase.from('players').select().eq('id', id).single();
    const { data: spells } = await supabase.from('spells').select();

    if (!player) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            player,
            spells,
        }
    }
}
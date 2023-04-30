import { NextPageContext } from 'next';
import { CreatePlayerData } from "@/pages/players/index";
import { CreateSpellData } from "@/pages/spells";
import api from "@/services/api";
import { CreateArmorData } from "@/pages/armors";
import PlayerSpells from "@/components/PlayerSpells";
import PlayerItems from "@/components/PlayerItems";

type Props = {
    player: CreatePlayerData,
    spells: CreateSpellData[],
    armors: CreateArmorData[],
};

export default function Player({ player, spells, armors }: Props) {
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

            <PlayerSpells player={player} spells={spells} />

            <PlayerItems player={player} armors={armors} />
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
    const armors = await api.get('/armors');

    return {
        props: {
            player: player.data,
            spells: spells.data,
            armors: armors.data,
        }
    }
}
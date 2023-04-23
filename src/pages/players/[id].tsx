import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { PlayerResponse } from "@/pages/players/index";
import supabase from "@/services/supabase";

export default function Player({ player }: { player: PlayerResponse }) {
    const router = useRouter();
    const { id } = router.query;

    return (
        <main className="flex flex-col w-full flex-1 px-20">
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


        </main>
    );
}

export async function getServerSideProps(context: NextPageContext) {
    const { id } = context.query;
    const { data} = await supabase.from('players').select().eq('id', id).single();

    if (!data) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            player: data
        }
    }
}
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const data = await prisma.players.findMany({
        include: {
            player_spells: {
                select: {
                    spell_id: true
                },
            },
            player_items: {
                select: {
                    item_id: true
                },
            },
        }
    });

    const playersWithSpellIds = data.map(player => {
        const spellIds = player.player_spells.map(playerSpell => playerSpell.spell_id);
        const itemIds = player.player_items.map(playerItem => playerItem.item_id);
        return { ...player, player_spells: spellIds, player_items: itemIds };
    });

    res.status(200).json(playersWithSpellIds);
}
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
            }
        }
    });

    const playersWithSpellIds = data.map(player => {
        const spellIds = player.player_spells.map(playerSpell => playerSpell.spell_id);
        return { ...player, player_spells: spellIds };
    });

    res.status(200).json(playersWithSpellIds);
}
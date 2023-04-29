import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = parseInt(req.query.id as string);
    const data = await prisma.players.findUnique({
        where: {
            id: id,
        },
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

    res.status(200).json(data);
}
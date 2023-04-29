import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const data = await prisma.items.findMany({
        where: {
            type: 'armor'
        },
        include: {
            armors: true,
        },
    });

    if (data) {
        const response = data.map(item => {
            const armor = item.armors.splice(0, 1)[0];

            return {
                id: item.id,
                name: item.name,
                type: item.type,
                base: armor.base,
                additional: armor.additional,
            }
        });

        res.status(200).json(response);
    } else {
        res.status(500).json({ error: 'Unable to fetch armors' });
    }
}

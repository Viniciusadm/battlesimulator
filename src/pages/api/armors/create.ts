import type { NextApiRequest, NextApiResponse } from 'next'
import { CreateArmorData } from "@/pages/armors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const payload = req.body as CreateArmorData;
    const item = await prisma.items.create({
        data: {
            name: payload.name,
            type: 'armor',
        },
    });

    if (!item) {
        res.status(500).json({ error: 'Unable to create player' });
    }

    await prisma.armors.create({
        data: {
            item_id: item.id,
            base: payload.base,
            additional: payload.additional,
        }
    });

    const data = await prisma.items.findFirst({
        where: {
            id: item.id,
        },
        include: {
            armors: true,
        },
    });

    if (data) {
        const armor = data.armors.splice(0, 1)[0];

        const response = {
            id: data.id,
            name: data.name,
            type: data.type,
            base: armor.base,
            additional: armor.additional,
        }

        res.status(201).json(response);
    } else {
        res.status(500).json({ error: 'Unable to create player' });
    }
}

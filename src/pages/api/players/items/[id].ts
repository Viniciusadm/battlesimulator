import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const armor: number = req.body.armor;
    const id = parseInt(req.query.id as string);

    await prisma.player_items.deleteMany({
        where: {
            player_id: id,
            equipped: true,
        },
    });

    if (armor) {
        const item_armor = await prisma.player_items.create({
            data: {
                player_id: id,
                item_id: armor,
                equipped: true,
            }
        });
        res.status(201).json(item_armor);
    }

    res.status(201).json({ message: "Item(s) added" });
}

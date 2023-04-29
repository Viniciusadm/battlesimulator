import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const payload = req.body;
    const data = await prisma.players.create({
        data: payload,
    });

    if (data) {
        res.status(201).json(data);
    } else {
        res.status(500).json({ error: 'Unable to create player' });
    }
}

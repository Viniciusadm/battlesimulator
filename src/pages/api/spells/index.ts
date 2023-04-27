import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const data = await prisma.spells.findMany();
    res.status(200).json(data.map((spell) => {
        return {
            ...spell,
            dices: JSON.parse(spell.dices),
        }
    }));
}
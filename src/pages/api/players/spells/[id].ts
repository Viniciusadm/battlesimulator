import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const spells: number[] = req.body.spells;
    const id = parseInt(req.query.id as string);

    const existingSpells = await prisma.player_spells.findMany({
        where: {
            player_id: id,
            spell_id: { in: spells },
        },
        select: {
            spell_id: true,
        },
    });

    const existingSpellIds = new Set(existingSpells.map(s => s.spell_id));
    const spellsToDelete = await prisma.player_spells.deleteMany({
        where: {
            player_id: id,
            spell_id: { notIn: spells },
        },
    });

    const newSpells = spells.filter(s => !existingSpellIds.has(s));
    const response = await Promise.all(newSpells.map(spell => {
        return prisma.player_spells.create({
            data: {
                spell_id: spell,
                player_id: id,
            },
        });
    }));

    res.status(201).json([...response, spellsToDelete]);
}

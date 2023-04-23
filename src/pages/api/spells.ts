import type { NextApiRequest, NextApiResponse } from 'next'

export type ResponseSpell = {
    id: string;
    name: string;
    energyCost: number;
    dices: number[];
    type: 'attack' | 'heal';
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseSpell[]>
) {
    res.status(200).json([] as ResponseSpell[]);
}


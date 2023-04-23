import type { NextApiRequest, NextApiResponse } from 'next'
import { onValue, ref } from "firebase/database";
import { database } from "@/services/firebase";

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
    const spells: ResponseSpell[] = [];
    const dbRef = ref(database, 'spells');
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(key => {
                const spell = {
                    id: key,
                    ...data[key],
                };

                spells.push(spell);
            });
        }
    });
    res.status(200).json(spells);
}


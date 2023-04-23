import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from "@/services/supabase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let { data } = await supabase.from('players').select();
    res.status(200).json(data);
}

import { createContext, ReactNode, useEffect, useState } from "react";
import api from "@/services/api";

type ItemsContextType = {
    spells: Spell[];
    getSpell: (name: string) => Spell | undefined;
}

type ItemsContextProviderProps = {
    children: ReactNode;
}

import Dice from "@/battlerpg/Classes/Dice";
import { ResponseSpell } from "@/pages/api/spells";

export type Spell = {
    id: string;
    name: string;
    energyCost: number;
    dices: Dice[];
    type: 'attack' | 'heal';
};

export const ItemsContext = createContext({} as ItemsContextType);

export function ItemsContextProvider({ children }: ItemsContextProviderProps) {
    const [spells, setSpells] = useState<Spell[]>([] as Spell[]);

    const getSpell = (name: string): Spell | undefined => {
        return spells.find(spell => spell.name === name);
    }

    const getSpells = () => {

        api.get<ResponseSpell[]>('/spells').then(response => {
            const responseSpells: Spell[] = [];
            response.data.forEach(spell => {
                responseSpells.push({
                    ...spell,
                    dices: spell.dices.map(dice => {
                        return new Dice(dice);
                    })
                });
            });
            setSpells(responseSpells);
        });
    }


    useEffect(() => {
        getSpells();
    }, []);

    return (
        <ItemsContext.Provider value={{ spells, getSpell }}>
            { children }
        </ItemsContext.Provider>
    );
}
import Player from "@/battlerpg/Classes/Player";
import { getSpell } from "@/battlerpg/Database/spells";
import { d10, d6, d8 } from "@/battlerpg/Helpers/dices";

const Kazuma = new Player({
    name: "Kazuma",
}, {
    strength: 15,
    dexterity: 12,
    charisma: 13,
    constitution: 14,
    intelligence: 8,
    wisdom: 10,
});

Kazuma.setWatchArmor(12, true);
Kazuma.setWatchWeapon(d8, 'melee');

const Megumin = new Player({
    name: "Megumin",
}, {
    strength: 13,
    dexterity: 14,
    charisma: 10,
    constitution: 12,
    intelligence: 15,
    wisdom: 8,
});

const firebal = getSpell('Explosion');
if (firebal) {
    Megumin.addSpell(firebal);
}
const heal = getSpell('Heal');
if (heal) {
    Megumin.addSpell(heal);
}
Megumin.setWatchWeapon(d6, 'range');

const Darkness = new Player({
    name: "Darkness",
}, {
    strength: 15,
    dexterity: 12,
    charisma: 13,
    constitution: 14,
    intelligence: 8,
    wisdom: 10,
});

Darkness.setWatchArmor(18, false);
Darkness.setWatchWeapon(d10, 'melee');

export const players = {
    Kazuma,
    Megumin,
    Darkness,
};


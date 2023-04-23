-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "strength" INTEGER NOT NULL,
    "intelligence" INTEGER NOT NULL,
    "charisma" INTEGER NOT NULL,
    "wisdom" INTEGER NOT NULL,
    "dexterity" INTEGER NOT NULL,
    "constitution" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spells" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "energy_cost" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "dices" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_spells" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "spell_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_spells_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "player_spells" ADD CONSTRAINT "player_spells_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_spells" ADD CONSTRAINT "player_spells_spell_id_fkey" FOREIGN KEY ("spell_id") REFERENCES "spells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

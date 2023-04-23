import Player from "@/battlerpg/Classes/Player";

function Bar({ text, value, color = 'bg-green-500' }: { text: string, value: number, color?: string }) {
    return (
        <div className="bg-gray-300 h-8 rounded-full mb-2 w-full relative flex items-center">
            <p className="text-white font-bold z-10 absolute w-full text-center text-sm lg:text-base">
                {text}
            </p>
            <div
                className={`${color} h-8 rounded-full transition-all duration-1000 absolute top-0`}
                style={{ width: `${value}%` }}
            >
            </div>
        </div>
    );
}

export default function PlayerStatus({ player, victory }: { player: Player, victory: number }) {
    const life = player.getLife() > 0 ? player.getLife().toFixed(2) : 0;
    return (
        <div className="flex flex-col items-center mr-3 w-2/5">
            <p className="text-xl lg:text-2xl font-bold mb-1">
                {player.getName()}
            </p>
            <p className="text-base lg:text-xl font-bold mb-1">
                {victory} victories
            </p>

            <Bar
                text={`${life}%`}
                value={life as number}
            />

            <Bar
                text={`${player.getEnergy()} / ${player.getMaxEnergy()}`}
                value={player.getEnergy() / player.getMaxEnergy() * 100}
                color="bg-blue-500"
            />

            <p>Potions: {player.getQuantity('Potion')}</p>
        </div>
    );
}
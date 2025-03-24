import ButtonCapacity from "./ButtonCapacity/ButtonCapacity";
import ProgressBar from "./ProgressBar/ProgressBar";

const attacks = [
  {
    name: "Frappe",
    damage: 5,
    manaCost: 5,
    icon: "fa-bomb",
    description: "Attaque basique"
  },
  {
    name: "Éclair",
    damage: 8,
    manaCost: 8,
    icon: "fa-bolt",
    description: "Attaque électrique"
  },
  {
    name: "Boule de feu",
    damage: 12,
    manaCost: 10,
    icon: "fa-fire",
    description: "Attaque de feu"
  },
  {
    name: "Ult",
    damage: 100,
    manaCost: 20,
    icon: "fa-plus",
    description: "Restaure des PV"
  }
];

function PlayerCard({ player }) {
  return (
    <div
      key={player.id}
      className="col-sm-3 card center"
      id={`joueur${player.id}`}
    >
      <div className="card-body text-center">
        <h5 className="card-title">{player.name}</h5>
        <ProgressBar
          pv={player.pv}
          pvMax={player.pvMax}
          faType="fa-heart"
          barName=" : pv "
          bgType="bg-danger"
        />
        <ProgressBar
          pv={player.mana}
          pvMax={player.manaMax}
          faType="fa-fire-alt"
          barName=" : mana "
        />

        <span className="badge badge-danger ml-2 " id="degatSpanJ1"></span>
        <div className="row ">
          <div>
            {attacks.map((attack, index) => (
              <ButtonCapacity key={index} attack={attack} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;

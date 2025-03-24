import ButtonCapacity from "./ButtonCapacity/ButtonCapacity";
import ProgressBar from "./ProgressBar/ProgressBar";
import { useSelector } from 'react-redux';

const getAttacks = (playerClass) => {
  switch (playerClass) {
    case "Guerrier":
      return [
        {
          name: "Frappe Brutale",
          damage: 20,
          cooldown: 2, // Dégâts moyens = cooldown moyen
          icon: "fa-fist-raised",
          description: "Coup puissant (Cooldown: 2 tours)",
          type: "damage"
        },
        {
          name: "Tourbillon",
          damage: 35,
          cooldown: 4, // Dégâts élevés = cooldown plus long
          icon: "fa-sync-alt",
          description: "Attaque de zone (Cooldown: 4 tours)",
          type: "damage"
        },
        {
          name: "Cri de Guerre",
          damage: 15,
          cooldown: 1, // Faibles dégâts = cooldown court
          icon: "fa-volume-up",
          description: "Attaque qui redonne du moral (Cooldown: 1 tour)",
          type: "damage"
        },
        {
          name: "Exécution",
          damage: 50,
          cooldown: 5, // Dégâts très élevés = cooldown très long
          icon: "fa-skull",
          description: "Puissante attaque finale (Cooldown: 5 tours)",
          type: "damage"
        }
      ];

    case "Mage":
      return [
        {
          name: "Boule de Feu",
          damage: 35,
          cooldown: 3,
          icon: "fa-fire",
          description: "Sort de feu puissant (Cooldown: 3 tours)",
          type: "damage"
        },
        {
          name: "Éclair",
          damage: 25,
          cooldown: 2,
          icon: "fa-bolt",
          description: "Attaque rapide (Cooldown: 2 tours)",
          type: "damage"
        },
        {
          name: "Nova de Glace",
          damage: 15,
          cooldown: 1,
          icon: "fa-snowflake",
          description: "Sort de glace qui ralentit (Cooldown: 1 tour)",
          type: "damage"
        },
        {
          name: "Méditation",
          damage: 0,
          cooldown: 4, // Capacité utilitaire = cooldown moyen-long
          icon: "fa-moon",
          description: "Restaure du mana (Cooldown: 4 tours)",
          type: "mana"
        }
      ];

    case "Prêtre":
      return [
        {
          name: "Frappe Divine",
          damage: 20,
          cooldown: 2,
          icon: "fa-sun",
          description: "Attaque de lumière (Cooldown: 2 tours)",
          type: "damage"
        },
        {
          name: "Soin Divin",
          damage: -30,
          cooldown: 3, // Soin puissant = cooldown moyen
          icon: "fa-plus-circle",
          description: "Soigne un allié (Cooldown: 3 tours)",
          type: "heal"
        },
        {
          name: "Don de Mana",
          damage: 0,
          cooldown: 4, // Capacité utilitaire = cooldown moyen-long
          icon: "fa-tint",
          description: "Restaure le mana d'un allié (Cooldown: 4 tours)",
          type: "mana"
        },
        {
          name: "Châtiment",
          damage: 40,
          cooldown: 5, // Dégâts très élevés = cooldown très long
          icon: "fa-hand-sparkles",
          description: "Puissante attaque sacrée (Cooldown: 5 tours)",
          type: "damage"
        }
      ];

    case "Assassin":
      return [
        {
          name: "Coup Sournois",
          damage: 30,
          cooldown: 3,
          icon: "fa-user-ninja",
          description: "Attaque furtive (Cooldown: 3 tours)",
          type: "damage"
        },
        {
          name: "Poison",
          damage: 15,
          cooldown: 2,
          icon: "fa-skull-crossbones",
          description: "Empoisonne la cible (Cooldown: 2 tours)",
          type: "damage"
        },
        {
          name: "Double Lame",
          damage: 45,
          cooldown: 4,
          icon: "fa-khanda",
          description: "Double attaque rapide (Cooldown: 4 tours)",
          type: "damage"
        },
        {
          name: "Vol de Vie",
          damage: 25,
          cooldown: 3,
          icon: "fa-heart",
          description: "Vole de la vie (Cooldown: 3 tours)",
          type: "damage"
        }
      ];

    default:
      return [];
  }
};

const classThemes = {
  Guerrier: {
    gradient: "linear-gradient(135deg, #8B0000, #A52A2A)",
    accentColor: "#FF4500"
  },
  Mage: {
    gradient: "linear-gradient(135deg, #000080, #4169E1)",
    accentColor: "#00BFFF"
  },
  Prêtre: {
    gradient: "linear-gradient(135deg, #FFD700, #DAA520)",
    accentColor: "#FFA500"
  },
  Assassin: {
    gradient: "linear-gradient(135deg, #2F4F4F, #696969)",
    accentColor: "#A9A9A9"
  }
};

function PlayerCard({ player }) {
  const activePlayerId = useSelector(state => state.fight.activePlayerId);
  const isActive = player.id === activePlayerId;
  
  return (
    <div className={`col-sm-3 card center ${isActive ? 'active-player' : 'inactive-player'}`} id={`joueur${player.id}`}>
      <div className="card-body">
        <h5 className="card-title">{player.name}</h5>
        
        <div className="stats-container">
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
        </div>

        <div className="buttons-container">
          {getAttacks(player.class).map((attack, index) => (
            <ButtonCapacity 
              key={index} 
              attack={attack} 
              playerId={player.id}
              disabled={!isActive || player.pv <= 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;

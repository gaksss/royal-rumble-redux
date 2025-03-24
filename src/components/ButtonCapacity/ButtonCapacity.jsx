import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { hitMonster, hitBack, healPlayer, useMana, restoreMana, nextTurn, useAttack } from "../../features/fight/fightSlice";
import "./ButtonCapacity.css";

function ButtonCapacity({ attack, playerId, disabled }) {
  const dispatch = useDispatch();
  const monsterPV = useSelector(state => state.fight.monster.pv);
  const player = useSelector(state => state.fight.players.find(p => p.id === playerId));
  const allPlayers = useSelector(state => state.fight.players);
  const cooldowns = useSelector(state => state.fight.cooldowns[playerId] || {});
  
  const isOnCooldown = cooldowns[attack.name] > 0;
  const cooldownRemaining = cooldowns[attack.name] || 0;

  const [targetingMode, setTargetingMode] = useState(false);

  // Reset targeting mode when player changes
  useEffect(() => {
    setTargetingMode(false);
  }, [playerId]);

  const handleActionAndNextTurn = () => {
    // Consommer le mana avant toute action
    dispatch(useMana({ cost: attack.manaCost, playerId }));

    // Appliquer le cooldown avant toute action
    dispatch(useAttack({ 
      playerId, 
      attackName: attack.name, 
      cooldown: attack.cooldown 
    }));

    // Créer les effets visuels
    if (attack.type === "damage") {
      const playerElement = document.getElementById(`joueur${playerId}`);
      const monsterElement = document.querySelector('.monster img');
      if (playerElement && monsterElement) {
        const rect1 = playerElement.getBoundingClientRect();
        const rect2 = monsterElement.getBoundingClientRect();
        createParticles(
          attack.element || 'fire',
          rect1.left + rect1.width/2,
          rect1.top + rect1.height/2,
          rect2.left + rect2.width/2,
          rect2.top + rect2.height/2
        );
      }
    }

    // Contre-attaque du monstre
    const alivePlayers = allPlayers.filter(p => p.pv > 0);
    if (alivePlayers.length > 0) {
      const randomTarget = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      const damage = Math.floor(Math.random() * 15) + 10;
      dispatch(hitBack({ damage, targetId: randomTarget.id }));
    }

    // Passer au tour suivant
    dispatch(nextTurn());
  };

  const handleTargetSelection = (targetId) => {
    if (attack.type === "heal") {
      dispatch(healPlayer({ heal: -attack.damage, targetId }));
      
      // Effet visuel de soin
      const targetElement = document.getElementById(`joueur${targetId}`);
      if (targetElement) {
        targetElement.classList.add('AnimationHeal');
        setTimeout(() => targetElement.classList.remove('AnimationHeal'), 1000);
        createParticles('holy', 
          targetElement.getBoundingClientRect().left + targetElement.offsetWidth/2,
          targetElement.getBoundingClientRect().top + targetElement.offsetHeight/2,
          targetElement.getBoundingClientRect().left + targetElement.offsetWidth/2,
          targetElement.getBoundingClientRect().top - 50
        );
      }
    } else if (attack.type === "mana") {
      dispatch(restoreMana({ amount: attack.manaRestore, targetId }));
      
      // Effet visuel de restauration de mana
      const targetElement = document.getElementById(`joueur${targetId}`);
      if (targetElement) {
        targetElement.classList.add('mana-restore');
        setTimeout(() => targetElement.classList.remove('mana-restore'), 1000);
        createParticles('mana', 
          targetElement.getBoundingClientRect().left + targetElement.offsetWidth/2,
          targetElement.getBoundingClientRect().top + targetElement.offsetHeight,
          targetElement.getBoundingClientRect().left + targetElement.offsetWidth/2,
          targetElement.getBoundingClientRect().top,
          30 // Plus de particules pour l'effet de mana
        );
      }
    }
    
    handleActionAndNextTurn();
    setTargetingMode(false);
  };

  // Ajout d'un gestionnaire d'annulation du ciblage
  const handleCancelTargeting = () => {
    setTargetingMode(false);
  };

  const createParticles = (type, startX, startY, endX, endY, particleCount = 15) => {
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = `particle particle-${type}`;
      
      // Position de départ aléatoire autour du point initial
      const randomOffsetX = (Math.random() - 0.5) * 40;
      const randomOffsetY = (Math.random() - 0.5) * 40;
      
      // Calculer la direction vers la cible
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Ajouter une variation aléatoire à la destination
      const targetOffsetX = (Math.random() - 0.5) * 100;
      const targetOffsetY = (Math.random() - 0.5) * 100;
      
      // Définir les propriétés CSS personnalisées pour l'animation
      particle.style.setProperty('--endX', `${deltaX + targetOffsetX}px`);
      particle.style.setProperty('--endY', `${deltaY + targetOffsetY}px`);
      
      // Position initiale
      particle.style.left = `${startX + randomOffsetX}px`;
      particle.style.top = `${startY + randomOffsetY}px`;
      
      // Ajouter un délai aléatoire pour l'animation
      particle.style.animationDelay = `${Math.random() * 0.2}s`;
      
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000); // Supprimer après l'animation
    }
  };

  const fight = () => {
    if (monsterPV <= 0 || player.pv <= 0 || player.mana < attack.manaCost || isOnCooldown) return;

    if (attack.requiresTarget) {
      setTargetingMode(true);
      return;
    }

    // Effet de l'attaque
    dispatch(hitMonster({ damage: attack.damage, playerId }));
    
    // Gestion du mana et passage au tour suivant
    handleActionAndNextTurn();
  };

  if (targetingMode) {
    return (
      <div className="targeting-overlay">
        <div className="targeting-title">
          Sélectionner une cible pour {attack.name}
        </div>
        <div className="targeting-heroes">
          {/* Retiré le filtre pour permettre au prêtre de se cibler */}
          {allPlayers.map(p => (
            <div 
              key={p.id} 
              className={`hero-target ${p.pv <= 0 ? 'disabled' : ''} ${p.id === playerId ? 'self-target' : ''}`}
              onClick={() => p.pv > 0 && handleTargetSelection(p.id)}
            >
              <div className="hero-info">
                <div className="hero-name">
                  {p.name}
                  {p.id === playerId && " (Vous)"}
                </div>
                <div className="hero-stats">
                  <span className="hero-hp">
                    <i className="fas fa-heart"></i> {p.pv}
                  </span>
                  <span className="hero-mana">
                    <i className="fas fa-fire-alt"></i> {p.mana}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn-cancel"
          onClick={handleCancelTargeting}
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={fight}
      className={`btn btn-success material-tooltip-main ${isOnCooldown ? 'on-cooldown' : ''}`}
      disabled={disabled || monsterPV <= 0 || player.pv <= 0 || player.mana < attack.manaCost || isOnCooldown}
      title={`${attack.description}${isOnCooldown ? ` (Cooldown: ${cooldownRemaining} tours)` : ''}`}
    >
      <div className="attack-name">{attack.name}</div>
      <div className="attack-stats">
        {attack.damage !== 0 && (
          <span className="damage">
            <i className="fas fa-sword damage-icon"></i>
            {attack.damage}
          </span>
        )}
        {isOnCooldown && (
          <span className="cooldown">
            <i className="fas fa-hourglass-half"></i>
            {cooldownRemaining}
          </span>
        )}
        <span className="mana">
          <i className="fas fa-fire-alt mana-icon"></i>
          {attack.manaCost}
        </span>
      </div>
    </button>
  );
}

export default ButtonCapacity;

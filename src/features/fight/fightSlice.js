import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  players: [
    { 
      name: "Guerrier", 
      class: "Guerrier", 
      pv: 150, 
      pvMax: 150, 
      mana: 80, 
      manaMax: 80, 
      id: 1,
      title: "Le Protecteur",
      speciality: "Tank" 
    },
    { 
      name: "Mage", 
      class: "Mage", 
      pv: 80, 
      pvMax: 80, 
      mana: 200, 
      manaMax: 200, 
      id: 2,
      title: "L'Archmage",
      speciality: "DPS Magique" 
    },
    { 
      name: "Prêtre", 
      class: "Prêtre", 
      pv: 100, 
      pvMax: 100, 
      mana: 150, 
      manaMax: 150, 
      id: 3,
      title: "Le Guérisseur",
      speciality: "Support" 
    },
    { 
      name: "Assassin", 
      class: "Assassin", 
      pv: 90, 
      pvMax: 90, 
      mana: 100, 
      manaMax: 100, 
      id: 4,
      title: "L'Ombre",
      speciality: "DPS Physique" 
    }
  ],
  monster: {
    name: "Dragon Ancien",
    title: "Le Dévoreur de Mondes",
    pv: 800,
    pvMax: 800,
  },
  currentTurn: 1,
  activePlayerId: 1, // ID du joueur actif
  manaRegenRate: 10, // Mana regagné par tour
  cooldowns: {
    1: {}, // Pour joueur 1: { "Frappe Brutale": 0, "Tourbillon": 0, ... }
    2: {}, // Pour joueur 2
    3: {}, // Pour joueur 3
    4: {}  // Pour joueur 4
  }
};

export const fightSlice = createSlice({
  name: "fight",
  initialState,
  reducers: {
    hitMonster: (state, action) => {
      const { damage } = action.payload;
      state.monster.pv = Math.max(0, state.monster.pv - damage);
    },
    hitBack: (state, action) => {
      const { damage, targetId } = action.payload;
      const targetPlayer = state.players.find(p => p.id === targetId);
      if (targetPlayer) {
        targetPlayer.pv = Math.max(0, targetPlayer.pv - damage);
      }
    },
    healPlayer: (state, action) => {
      const { heal, targetId } = action.payload;
      const targetPlayer = state.players.find(p => p.id === targetId);
      if (targetPlayer) {
        targetPlayer.pv = Math.min(targetPlayer.pvMax, targetPlayer.pv + heal);
      }
    },
    useMana: (state, action) => {
      const { cost, playerId } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        player.mana = Math.max(0, player.mana - cost);
      }
    },
    restoreMana: (state, action) => {
      const { amount, targetId } = action.payload;
      const targetPlayer = state.players.find(p => p.id === targetId);
      if (targetPlayer) {
        targetPlayer.mana = Math.min(targetPlayer.manaMax, targetPlayer.mana + amount);
      }
    },
    nextTurn: (state) => {
      state.currentTurn += 1;
      
      // Réduire les cooldowns de toutes les capacités
      Object.keys(state.cooldowns).forEach(playerId => {
        if (state.cooldowns[playerId]) {
          Object.keys(state.cooldowns[playerId]).forEach(attackName => {
            if (state.cooldowns[playerId][attackName] > 0) {
              state.cooldowns[playerId][attackName] -= 1;
            }
          });
        }
      });

      // Vérifier s'il reste des joueurs vivants
      const alivePlayers = state.players.filter(p => p.pv > 0);
      if (alivePlayers.length === 0) return;
    
      // Trouver le prochain joueur vivant
      let nextPlayerId = state.activePlayerId;
      let checkedPlayers = 0;
      let foundNextPlayer = false;
      
      while (checkedPlayers < state.players.length && !foundNextPlayer) {
        nextPlayerId = nextPlayerId % state.players.length + 1;
        const nextPlayer = state.players.find(p => p.id === nextPlayerId);
        if (nextPlayer && nextPlayer.pv > 0) {
          state.activePlayerId = nextPlayerId;
          foundNextPlayer = true;
        }
        checkedPlayers++;
      }
    
      // Si on n'a pas trouvé de prochain joueur vivant, prendre le premier joueur vivant
      if (!foundNextPlayer && alivePlayers.length > 0) {
        state.activePlayerId = alivePlayers[0].id;
      }
      
      // Régénération de mana améliorée
      alivePlayers.forEach(player => {
        // Base de régénération
        let manaRegen = state.manaRegenRate;
        
        // Bonus de régénération si bas en mana
        if (player.mana < player.manaMax * 0.3) {
          manaRegen *= 1.5; // 50% de bonus quand peu de mana
        }
        
        // Bonus pour les mages
        if (player.class === "Mage") {
          manaRegen *= 1.2; // 20% de bonus pour les mages
        }
        
        player.mana = Math.min(player.manaMax, player.mana + Math.floor(manaRegen));
      });
    },
    resetGame: (state) => {
      return {
        ...initialState,
        currentTurn: 1,
        activePlayerId: 1
      };
    },
    useAttack: (state, action) => {
      const { playerId, attackName, cooldown } = action.payload;
      if (!state.cooldowns[playerId]) {
        state.cooldowns[playerId] = {};
      }
      // Mettre en place le cooldown
      state.cooldowns[playerId][attackName] = cooldown;
    }
  }
});

// Export des actions
export const { hitMonster, hitBack, healPlayer, useMana, restoreMana, nextTurn, resetGame, useAttack } = fightSlice.actions;

// Nous exportons le reducer généré automatiquement
export default fightSlice.reducer;

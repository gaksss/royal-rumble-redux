import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  players: [
    // Nous stockerons nos combattants ici sous forme de tableau
    // Exemple: 1: { name: "John", pv: 100, pvMax: 100, mana: 30, manaMax: 30, id: 1 },
    { name: "John", pv: 100, pvMax: 100, mana: 30, manaMax: 30, id: 1 },
    { name: "Jack", pv: 100, pvMax: 100, mana: 30, manaMax: 30, id: 2 },
    { name: "Jessy", pv: 100, pvMax: 100, mana: 30, manaMax: 30, id: 3 },
    { name: "Jenny", pv: 100, pvMax: 100, mana: 30, manaMax: 30, id: 4 },
  ],
  monster: {
    // Notre boss à combattre
    // Exemple: { name: "Dragon", pv: 200, pvMax: 200, strength: 15 }
    name: "Crypto",
    pv: 800,
    pvMax: 800,
  },
};

export const fightSlice = createSlice({
  name: "fight",
  initialState,
  reducers: {
    hitMonster: (state, action) => {
      // Le payload de l'action contient la force de frappe
      const damage = action.payload;

      // Avec Redux Toolkit, nous pouvons "muter" l'état directement
      // grâce à Immer qui fonctionne sous le capot
      state.monster.pv = Math.max(0, state.monster.pv - damage);

      // Pas besoin de return car Immer s'occupe de créer un nouvel état
    },
  },
});

// Export des actions
export const { hitMonster } = fightSlice.actions;

// Nous exportons le reducer généré automatiquement
export default fightSlice.reducer;

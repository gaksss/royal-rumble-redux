import { useSelector, useDispatch } from 'react-redux';
import './GameStatus.css';
import { resetGame } from '../../features/fight/fightSlice';

function GameStatus() {
  const dispatch = useDispatch();
  const monsterPV = useSelector(state => state.fight.monster.pv);
  const players = useSelector(state => state.fight.players);
  
  const allPlayersDead = players.every(player => player.pv <= 0);
  
  const handleRestart = () => {
    dispatch(resetGame());
  };

  if (monsterPV <= 0 || allPlayersDead) {
    return (
      <div className="modal-overlay">
        <div className="game-end-modal">
          {monsterPV <= 0 ? (
            <>
              <h2 className="victory-title">🎉 Victoire ! 🎉</h2>
              <p>L'alien a été vaincu !</p>
            </>
          ) : (
            <>
              <h2 className="defeat-title">💀 Défaite ! 💀</h2>
              <p>Tous les héros sont tombés au combat...</p>
            </>
          )}
          <button className="restart-button" onClick={handleRestart}>
            <i className="fas fa-redo"></i> Rejouer
          </button>
        </div>
      </div>
    );
  }
  
  return null;
}

export default GameStatus;
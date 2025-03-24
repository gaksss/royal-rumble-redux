import './App.css'
import Monster from './components/Monster/Monster'
import PlayerList from './components/PlayerList'
import GameStatus from './components/GameStatus/GameStatus';
import { useSelector } from 'react-redux';

function App() {
  const activePlayer = useSelector(state => 
    state.fight.players.find(p => p.id === state.fight.activePlayerId)
  );
  const currentTurn = useSelector(state => state.fight.currentTurn);

  return (
    <div className="App">
      <Monster />
      <div className="turn-indicator">
        Tour {currentTurn} - {activePlayer?.name}
      </div>
      <section className="container-fluid">
        <PlayerList />
      </section>
      <GameStatus />
    </div>
  );
}

export default App

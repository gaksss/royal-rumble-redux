import { useSelector } from "react-redux";
import PlayerCard from "./PlayerCard";

function PlayerList() {
  const activePlayerId = useSelector(state => state.fight.activePlayerId);
  const players = useSelector(state => state.fight.players);
  const activePlayer = players.find(p => p.id === activePlayerId);

  return (
    <div className="row">
      {activePlayer && (
        <PlayerCard player={activePlayer} />
      )}
    </div>
  );
}

export default PlayerList;

import { useDispatch } from "react-redux";
import { hitMonster } from "../../features/fight/fightSlice";
import "./ButtonCapacity.css";

function ButtonCapacity({ attack }) {
  const dispatch = useDispatch();

  const fight = () => {
    dispatch(hitMonster(attack.damage));
    console.log(`🗡️ ${attack.name} lancée !`);
  };

  return (
    <button
      type="button"
      onClick={fight}
      className="btn btn-success material-tooltip-main"
      title={attack.description}
    >
      {attack.name}
      <i className={`fas ${attack.icon}`}></i> {attack.damage}
      <i className="fas fa-fire-alt"></i> - {attack.manaCost}
    </button>
  );
}

export default ButtonCapacity;

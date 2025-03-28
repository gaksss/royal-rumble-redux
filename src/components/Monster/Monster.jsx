import "./Monster.css";
import ProgressBar from "../ProgressBar/ProgressBar";
import { useSelector } from "react-redux";

function Monster() {
  // Le hook useSelector nous permet d'extraire des données du store Redux
  const monster = useSelector((state) => state.fight.monster);
  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="card-monstre col-sm-12">
            <div id="monsterCard">
              <div className="text-center">
                <div className="row">
                  <div className="col-sm-2 offset-sm-3">
                    <span
                      className="badge badge-danger ml-2 "
                      id="degatSpanMonster"
                    ></span>
                    <img
                      className="img-fluid"
                      src="http://res.publicdomainfiles.com/pdf_view/67/13925387417373.png"
                      alt="monster"
                    />
                  </div>

                  <div id="comboOnMonster" className="col-sm-6"></div>
                </div>
              </div>
              <ProgressBar
                pv={monster.pv}
                pvMax={monster.pvMax}
                bgType="bg-danger"
                faType="fa-heart"
                barName=" : pv"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Monster;

import React from 'react';

const Infos = (props) => {
  if (props.player) {
    const {health, xp, level, weapon} = props.player;
    const nextLevel = props.levels && props.levels.length > 0 ? props.levels[props.player.level] - xp : 0 ;
    const lightOnOff = props.displayCover ? "on" : "off";

    return (
      <div className="infos">
        <div className="stage">
          <label>Stage</label>{props.stage}
        </div>
        <div className="health">
          <label>Health</label>{health}
        </div>
        <div className="xp">
          <label>XP</label>{xp}
        </div>
        <div className="level">
          <label>Level</label>{level} (next in {nextLevel} XP)
        </div>
        <div className="power">
          <label>Weapon</label>{weapon}
        </div>
        <div className="switch-cover">
          <button onClick={props.switchCover}>Turn the light {lightOnOff}</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="infos">

      </div>
    )
  }
};

export default Infos;
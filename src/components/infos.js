import React from 'react';

const Infos = (props) => {
  if (props.player) {
    const {health, xp, level, weapon} = props.player;

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
          <label>Level</label>{level}
        </div>
        <div className="power">
          <label>Weapon</label>{weapon}
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
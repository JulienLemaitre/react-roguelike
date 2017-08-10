import React, { Component } from 'react';
import Background from './background';

class Board extends Component {

  constructor(props) {
    super(props);

    this.state={};
  }

  scrollPlayerIntoView () {
    const theBoard = document.querySelector(".game");
    let scrollLeft = null, scrollTop = null;

    if (theBoard) {
      const width = this.props.width;
      const height = this.props.height;
      const margin = width / 3;

      const left = theBoard.scrollLeft, right = left + width;
      const top = theBoard.scrollTop, bottom = top + height;

      const player = this.props.actors.find(actor => actor.type === "player");
      const center = player.pos.plus(player.size.times(0.5)).times(this.props.scale);

      if (center.x < left + margin)
        scrollLeft = center.x - margin;
      else if (center.x > right - margin)
        scrollLeft = center.x + margin - width;
      if (center.y < top + margin)
        scrollTop = center.y - margin;
      else if (center.y > bottom - margin)
        scrollTop = center.y + margin - height;

    }

    return { scrollLeft, scrollTop };
  }

  componentDidUpdate(props) {
    const scrollMove = this.scrollPlayerIntoView(props);
    if (this.divGame) {
      if (scrollMove.scrollLeft)
        this.divGame.scrollLeft = Math.floor(scrollMove.scrollLeft);
      if (scrollMove.scrollTop)
        this.divGame.scrollTop = Math.floor(scrollMove.scrollTop);
    }
  }

  render() {

    const drawActors = this.props.actors.map( (actor, index) => {
      const width = actor.size.x * this.props.scale + "px";
      const height = actor.size.y * this.props.scale + "px";
      const left = actor.pos.x * this.props.scale + "px";
      const top = actor.pos.y * this.props.scale + "px";

      return (
        <div
          key={`actor-${index}`}
          className={`actor ${actor.type}`}
          style={{ width, height, left, top }}
        ></div>
      );
    });


    return (
      <div
        className={`game ${this.props.gameStatus}`}
         style={{
           height : this.props.height,
           width : this.props.width,
         }}
        ref={ (div) => { this.divGame = div } }
      >
        <Background
          scale={this.props.scale}
          grid={this.props.grid}
        />

        {drawActors}
      </div>
    );
  }

}

export default Board;
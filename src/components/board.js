import React, { Component } from 'react';

class Board extends Component {

  constructor(props) {
    super(props);

    this.state={};
  }

  scrollPlayerIntoView () {
    console.log("props",this.props);
    // The viewport
    const theBoard = document.querySelector(".game");
    let scrollLeft = 0, scrollTop = 0;

    if (theBoard) {
      console.log("theBoard", theBoard);
      const width = this.props.width;
      const height = this.props.height;
      const margin = width / 3;

      const left = theBoard.scrollLeft, right = left + width;
      const top = theBoard.scrollTop, bottom = top + height;

      const player = this.props.actors.find(actor => actor.type === "player");
      const center = player.pos.plus(player.size.times(0.5)).times(this.props.scale);
      console.log("player:",player,"left:",left, "top:", top, "center:", center);

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
    console.log("scrollMove:",scrollMove,Math.floor(scrollMove.scrollLeft),Math.floor(scrollMove.scrollTop),"this.divGame:",this.divGame);
    if (this.divGame) {
      this.divGame.scrollLeft = Math.floor(scrollMove.scrollLeft) || 0;
      this.divGame.scrollTop = Math.floor(scrollMove.scrollTop) || 0;
    }
  }

  render() {
    const tableWidth = this.props.grid.length > 0 ? this.props.grid[0].length : 0;

    const drawBackground = this.props.grid.map( (row, index) => {
      return (
        <tr key={`row-${index}`} style={{ height: this.props.scale }}>
          {row.map( (cell, index) => {
            return (
              <td key={`cell-${index}`} className={cell}></td>
            );
          })}
        </tr>
      );
    });

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
        <table
          className="background"
          style={{ width : tableWidth * this.props.scale}}
        >
          <tbody>
            {drawBackground}
          </tbody>
        </table>

        {drawActors}
      </div>
    );
  }

}

export default Board;
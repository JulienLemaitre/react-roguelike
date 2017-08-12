import React, { Component } from 'react';
import Background from './background';

class Board extends Component {

  constructor(props) {
    super(props);

    this.state = {};

    this.scrollPlayerIntoView = this.scrollPlayerIntoView.bind(this);
  }

  // We create scrolling to follow the player
  // only when we get out of the safe place of the center thirs of width and height
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
      else if (center.x > right - margin) {
        scrollLeft = center.x + margin - width > this.props.grid[0].length * this.props.scale - width ?
          this.props.grid[0].length * this.props.scale - width :
          center.x + margin - width;
      }
      if (center.y < top + margin)
        scrollTop = center.y - margin;
      else if (center.y > bottom - margin) {
        scrollTop = center.y + margin - height > this.props.grid.length * this.props.scale - height ?
          this.props.grid.length * this.props.scale - height :
          center.y + margin - height;
      }

    }

    return { scrollLeft, scrollTop };
  }

  componentDidUpdate() {
    const scrollMove = this.scrollPlayerIntoView();
    // We update the scroll only if needed
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

    // This is the black shadow covering the board
    // and painting a circle of light around the player
    const drawCover = () => {
      const player = this.props.actors.find(actor => actor.type === "player");
      if (this.props.displayCover && player) {
        const radius = 6 * this.props.scale;
        const backgroundImage = `radial-gradient(circle ${radius}px at center, rgba(34,34,34,0) 0%, rgba(34,34,34,0.1) 30%, rgba(34,34,34,0.2) 40%,rgba(34,34,34,256) 100%)`;
        const width = (this.props.width * 2) + "px";
        const height = (this.props.height * 2) + "px";
        const center = player.pos.plus(player.size.times(0.5)).times(this.props.scale);
        const left = (center.x - (this.props.width)) + "px";
        const top = (center.y - (this.props.height)) + "px";

        return (
          <div
            className="cover"
            style={{ width, height, left, top, backgroundImage }}
          ></div>
        );
      }
    };


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
        {drawCover()}
      </div>
    );
  }

}

export default Board;
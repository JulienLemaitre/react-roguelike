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

    const drawCover = () => {
      const player = this.props.actors.find(actor => actor.type === "player");
      if (this.props.displayCover && player) {
        const radius = 8 * this.props.scale;
        const backgroundImage = `radial-gradient(circle ${radius}px at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 40%,rgba(0,0,0,256) 100%)`;
        console.log(backgroundImage);
        // const backgroundImage = "radial-gradient(16px at 60px 50px , #000000 0%, #000000 14px, rgba(0, 0, 0, 0.3) 18px, rgba(0, 0, 0, 0) 29px)";
        const width = (this.props.width * 2) + "px";
        const height = (this.props.height * 2) + "px";
        const left = ((player.pos.x + 0.5) * this.props.scale - (this.props.width)) + "px";
        const top = ((player.pos.y + 0.5) * this.props.scale - (this.props.height)) + "px";
        // console.log("player.pos.x",player.pos.x,"this.props.scale",this.props.scale,"this.props.width",this.props.width, "/ 4",this.props.width / 4);

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
import React from 'react';

function elt(name, className) {
  let elt = document.creatElement(name);
  if (className) elt.className = className;
  return elt;
}

function DomDisplay(parent, level) {
  this.wrap = parent.appendChild(elt("div", "game"));
  this.level = level;

  this.wrap.appendChild(this.drawBackground());
  this.actorLayer = null;
  this.drawFrame();
}

const Board = () => {

  return (
    <div className="board"></div>
  );
};

export default Board;
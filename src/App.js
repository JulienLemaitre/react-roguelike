import React, { Component } from 'react';
import './App.css';
import Infos from './components/infos';
import Board from './components/board';

const simpleLevelPlan = [
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "x         xxxxxxxxxxx              xxxxxxxxxxxxxxxxxxxxxxxxxxx           xxxxxxxxxxxxxxx",
  "x         xxxxxxxxxxx              xxxxxxxxxxxxxxxxxxxxxxxxxxx           xxxxxxxxxxxxxxx",
  "x         xxxxxxxxxxx xxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxx           xxxxxxxxxxxxxxx",
  "x                     xxxxxx                              xxxx           xxxx          x",
  "xxxxxxxxxxx           xxxxxx                              xxxx           xxxx          x",
  "xxxxxxxxxxx           xxxxxx                              xxxx           xxxx          x",
  "xxxxxxxxxxx           xxxxxx                                             xxxx          x",
  "xxxxxxxxxxx           xxxxxx                              xxxx           xxxx          x",
  "xxxxxxxxxxx           xxxxxx                              xxxx           xxxxxxxxxxxxx x",
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxx                              xxxx                         x",
  "xxx                        x                              xxxxxxxxxxx xxxx             x",
  "xxx                        x                              xxxxxx         x             x",
  "xxx                        xxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxx         x             x",
  "xxx                        xxxxx              xxxxxxxxxxxxxxxxxx         x             x",
  "xxx                        xxxxx              xxxxxxxxxxxxxxxxxx                       x",
  "xxxxxxxxxxxxxxx xxxxxxxxxxxxxxxx                               x         xxxxxxxxxxxx  x",
  "xxxxxxxxxxxxxx                 xxxx xxxxxxxxxxxxxx             x         xxxxx         x",
  "xxxxxxxxxxxxxx                         xxxxxxxxxxx                       xxxxx         x",
  "xxxxxxxxxxxxxx                         xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx         x",
  "xxxxxxxxxxxxxx                         xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx         x",
  "xxxxxxxxxxxxxx                         x          xxxxxxxxxxxxxxxxxxxxxxxxxxxx         x",
  "x            x                         x          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxx",
  "x            x                         x          xxxxxxxxxx                         xxx",
  "x                                                 xxxxxxxxxx                         xxx",
  "x            xxxxxxxxxxxxxxxxxxxxxxxxxxx          xxxxxxxxxx                         xxx",
  "x                          xxxxxxxxxxxxx          xxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxx",
  "x                          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx              xxxxxxxxxxxxx",
  "x                          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx              xxxxxxxxxxxxx",
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
];

const dungeons = {
  0: {
    enemy: { build: Enemy, amount: 1 },
    healthItem: { build: HealthItem, amount: 1 },
    player: { build: Player, amount: 1}
  },
  1: {
    enemy: { build: Enemy, amount: 2 },
    healthItem: { build: HealthItem, amount: 2 },
    player: { build: Player, amount: 1}
  },
  2: {
    enemy: { build: Enemy, amount: 3 },
    healthItem: { build: HealthItem, amount: 3 },
    player: { build: Player, amount: 1}
  },
  3: {
    enemy: { build: Enemy, amount: 4 },
    healthItem: { build: HealthItem, amount: 4 },
    player: { build: Player, amount: 1}
  },
  4: {
    enemy: { build: Enemy, amount: 5 },
    healthItem: { build: HealthItem, amount: 5 },
    boss: { build: Boss, amount: 1 },
    player: { build: Player, amount: 1}
  }
};

// level object constructor
function Level(plan, level) {
  this.width = plan[0].length;
  this.height = plan.length;
  this.level = level;
  this.grid = [];
  this.actors = [];

  for (let y=0 ; y < this.height ; y++) {
    let line = plan[y], gridLine = [];
    for (let x=0 ; x < this.width ; x++) {
      const ch = line.charAt(x);
      let fieldType = null;
      if (ch === "x")
        fieldType = "wall";
      gridLine.push(fieldType);
    }
    this.grid.push(gridLine);
  }

  this.status = this.finishDelay = null;
}

Level.prototype.isFinished = function() {
  return this.status != null && this.finishDelay < 0;
};

function randomActors(level, grid) {
  let newActors = [];
  for (let prop in dungeons[level]) {
    if (dungeons[level].hasOwnProperty(prop)) {
      for (let p = 0 ; p < dungeons[level][prop].amount ; p++) {
        const Actor = dungeons[level][prop].build;
        newActors.push(new Actor(findEmptyCell(grid, newActors), level));
      }
    }
  }
  return newActors;
}

function findEmptyCell(grid, actors) {
  const width = grid[0].length;
  const height = grid.length;
  const findXY = () => {
    let testX = Math.floor(Math.random() * width);
    let testY = Math.floor(Math.random() * height);
    if (grid[testY][testX] === "x") {
      return findXY();
    } else {
      const occupied = actors.filter( actor => {
        return (actor.x === testX && actor.y === testY);
      });
      if (occupied.length > 0) {
        return findXY();
      } else {
        return new Vector(testX, testY);
      }
    }
  };
  return findXY();
}

function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.times = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};

function Player(pos) {
  // this.pos = pos.plus(new Vector(0, -0.5));
  this.pos = pos;
  this.size = new Vector(1,1);
  this.health = 100;
  this.xp = 0;
  this.level = 0;
  this.weapon = 5;
}
Player.prototype.type = "player";

function Enemy(pos, level) {
  this.pos = pos;
  this.size = new Vector(1, 1);
  this.health = 30;
  this.power = 5 + level;
}
Enemy.prototype.type = "enemy";

function Boss(pos) {
  this.pos = pos;
  this.size = new Vector(2, 2);
  this.health = 100;
  this.power = 40;
}
Boss.prototype.type = "boss";

function HealthItem(pos) {
  this.pos = pos;
  this.health = 20;
}
HealthItem.prototype.type = "healthItem";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      level: {}
    };
  }

  componentDidMount() {
    let simpleLevel = new Level(simpleLevelPlan,0);
    simpleLevel.actors = randomActors(simpleLevel.level,simpleLevel.grid);
    console.log(simpleLevel.width, "by", simpleLevel.height, simpleLevel.actors);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>React Roguelike</h1>
        </div>
        <div className="App-body">
          <Infos />
          <Board />
        </div>
      </div>
    );
  }
}

export default App;

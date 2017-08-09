import React, { Component } from 'react';
import './App.css';
import Infos from './components/infos';
import Board from './components/board';


const simpleLevelPlan = [
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "x      xxxxxxx          xxxxxxxxxxxxxxxxxx        xxxxxxxxxx",
  "x      xxxxxxx          xxxxxxxxxxxxxxxxxx        xxxxxxxxxx",
  "x      xxxxxxx xxxxxxxx xxxxxxxxxxxxxxxxxx        xxxxxxxxxx",
  "x              xxxx                     xx        xxx      x",
  "xxxxxxx        xxxx                     xx        xxx      x",
  "xxxxxxx        xxxx                     xx        xxx      x",
  "xxxxxxx        xxxx                               xxx      x",
  "xxxxxxx        xxxx                     xx        xxx      x",
  "xxxxxxx        xxxx                     xx        xxxxxxxx x",
  "xxxxxxxxxxxxxxxxxxx                     xx                 x",
  "xx                x                     xxxxxxx xxx        x",
  "xx                x                     xxxx      x        x",
  "xx                xxxxxxxx xxxxxxxxxxxxxxxxx      x        x",
  "xx                xxxx          xxxxxxxxxxxx      x        x",
  "xx                xxxx          xxxxxxxxxxxx               x",
  "xxxxxxxxxx xxxxxxxxxxx                     x      xxxxxxxx x",
  "xxxxxxxxx            xxx xxxxxxxxx         x      xxx      x",
  "xxxxxxxxx                  xxxxxxx                xxx      x",
  "xxxxxxxxx                  xxxxxxxxxxxxxxxxxxxxxxxxxx      x",
  "xxxxxxxxx                  xxxxxxxxxxxxxxxxxxxxxxxxxx      x",
  "xxxxxxxxx                  x      xxxxxxxxxxxxxxxxxxx      x",
  "x       x                  x      xxxxxxxxxxxxxxxxxxxxx xxxx",
  "x       x                  x      xxxxxxx                 xx",
  "x                                 xxxxxxx                 xx",
  "x       xxxxxxxxxxxxxxxxxxxx      xxxxxxx                 xx",
  "x                 xxxxxxxxxx      xxxxxxxxx xxxxxxxxxxxxxxxx",
  "x                 xxxxxxxxxxxxxxxxxxxxxxxx         xxxxxxxxx",
  "x                 xxxxxxxxxxxxxxxxxxxxxxxx         xxxxxxxxx",
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
];

const dungeons = {
  0: {
    enemy: { build: Enemy, amount: 4 },
    healthItem: { build: HealthItem, amount: 1 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1}
  },
  1: {
    enemy: { build: Enemy, amount: 5 },
    healthItem: { build: HealthItem, amount: 2 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1}
  },
  2: {
    enemy: { build: Enemy, amount: 6 },
    healthItem: { build: HealthItem, amount: 3 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1}
  },
  3: {
    enemy: { build: Enemy, amount: 7 },
    healthItem: { build: HealthItem, amount: 4 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1}
  },
  4: {
    enemy: { build: Enemy, amount: 8 },
    healthItem: { build: HealthItem, amount: 5 },
    boss: { build: Boss, amount: 1 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1}
  }
};

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

function Enemy(pos, stage) {
  this.pos = pos;
  this.size = new Vector(1, 1);
  this.health = 30;
  this.power = 5 + stage;
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
  this.size = new Vector(1, 1);
  this.health = 20;
}
HealthItem.prototype.type = "healthItem";

function Weapon(pos) {
  this.pos = pos;
  this.size = new Vector(1, 1);
  this.power = 10;
}
Weapon.prototype.type = "weapon";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 800,
      height: 600,
      scale: 15,
      grid: [],
      stage: 0,
      actors: [],
      gameStatus: null,
      finishDelay: null,
    };

    this.buildLevel = this.buildLevel.bind(this);
    this.randomActors = this.randomActors.bind(this);
    this.findEmptyCell = this.findEmptyCell.bind(this);
    // this.scrollPlayerIntoView = this.scrollPlayerIntoView.bind(this);
  }

  componentDidMount() {
    let theGrid = this.buildLevel(simpleLevelPlan);
    let theActors = this.randomActors(this.state.stage, theGrid);
    // let scrollMove = this.scrollPlayerIntoView() || { scrollLeft: null, scrollTop: null };
    this.setState({ grid: theGrid, actors: theActors });
  }

  buildLevel(plan) {
    const width = plan[0].length;
    const height = plan.length;
    let grid = [];

    for (let y=0 ; y < height ; y++) {
      let line = plan[y], gridLine = [];
      for (let x=0 ; x < width ; x++) {
        const ch = line.charAt(x);
        let fieldType = null;
        if (ch === "x")
          fieldType = "wall";
        gridLine.push(fieldType);
      }
      grid.push(gridLine);
    }

    return grid;

  }

  // Level.prototype.isFinished = function() {
  //   return this.status != null && this.finishDelay < 0;
  // };

  randomActors(stage, grid) {
    let newActors = [];
    for (let prop in dungeons[stage]) {
      if (dungeons[stage].hasOwnProperty(prop)) {
        for (let p = 0 ; p < dungeons[stage][prop].amount ; p++) {
          const Actor = dungeons[stage][prop].build;
          newActors.push(new Actor(this.findEmptyCell(grid, newActors), stage));
        }
      }
    }
    return newActors;
  }

  findEmptyCell(grid, actors) {
    // console.log("grid",grid,"actors",actors);
    const width = grid[0].length;
    const height = grid.length;
    const findXY = () => {
      let testX = Math.floor(Math.random() * width);
      let testY = Math.floor(Math.random() * height);
      if (grid[testY][testX] === "wall") {
        return findXY();
      } else {
        const occupied = actors.filter( actor => {
          return (actor.pos.x === testX && actor.pos.y === testY);
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

  // scrollPlayerIntoView() {
  //   // The viewport
  //   const theBoard = document.querySelector(".game")[0];
  //   let scrollLeft = null, scrollTop = null;
  //
  //   if (theBoard) {
  //     const width = this.state.width;
  //     const height = this.state.height;
  //     const margin = width / 3;
  //
  //     const left = theBoard.scrollLeft, right = left + width;
  //     const top = theBoard.scrollTop, bottom = top + height;
  //
  //     const player = this.state.actors.find(actor => actor.type === "player");
  //     const center = player.pos.plus(player.size.times(0.5)).times(this.state.scale);
  //     console.log("player:",player,"left:",left, "top:", top, "center:", center);
  //
  //
  //     if (center.x < left + margin)
  //       scrollLeft = center.x - margin;
  //     else if (center.x > right - margin)
  //       scrollLeft = center.x + margin - width;
  //     if (center.y < top + margin)
  //       scrollTop = center.y - margin;
  //     else if (center.y > bottom - margin)
  //       scrollTop = center.y + margin - height;
  //   }
  //
  //   return { scrollLeft, scrollTop };
  // }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>React Roguelike</h1>
        </div>
        <div className="App-body">
          <Infos />
          <Board
            grid={this.state.grid}
            actors={this.state.actors}
            scale={this.state.scale}
            gameStatus={this.state.gameStatus}
            width={this.state.width}
            height={this.state.height}
            scrollLeft={this.state.scrollLeft}
            scrollTop={this.state.scrollTop}
          />
        </div>
      </div>
    );
  }
}

export default App;

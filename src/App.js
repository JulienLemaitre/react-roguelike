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
  "xxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxx",
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
  "xx                                      xxxxxxx xxx        x",
  "xx                x                     xxxx      x        x",
  "xx                xxxxxxxx xxxxxxxxxxxxxxxxx      x        x",
  "xx                xxxx          xxxxxxxxxxxx      x        x",
  "xx                xxxx          xxxxxxxxxxxx               x",
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",];

const dungeons = {
  0: {
    enemy: { build: Enemy, amount: 4 },
    healthItem: { build: HealthItem, amount: 1 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1},
    end: { build: End, amount: 1}
  },
  1: {
    enemy: { build: Enemy, amount: 5 },
    healthItem: { build: HealthItem, amount: 2 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1},
    end: { build: End, amount: 1}
  },
  2: {
    enemy: { build: Enemy, amount: 6 },
    healthItem: { build: HealthItem, amount: 3 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1},
    end: { build: End, amount: 1}
  },
  3: {
    enemy: { build: Enemy, amount: 7 },
    healthItem: { build: HealthItem, amount: 4 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1},
    end: { build: End, amount: 1}
  },
  4: {
    enemy: { build: Enemy, amount: 8 },
    healthItem: { build: HealthItem, amount: 5 },
    boss: { build: Boss, amount: 1 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1},
    end: { build: End, amount: 1}
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

function End(pos) {
  this.pos = pos;
  this.size = new Vector(1, 1);
}
End.prototype.type = "end";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 800,
      height: 600,
      scale: 20,
      grid: [],
      stage: 0,
      actors: [],
      gameStatus: null,
      finishDelay: null,
    };

    this.buildLevel = this.buildLevel.bind(this);
    this.randomActors = this.randomActors.bind(this);
    this.findEmptyCell = this.findEmptyCell.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.interactWith = this.interactWith.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.endStage = this.endStage.bind(this);
    this.stageIsOver = this.stageIsOver.bind(this);
  }

  componentDidMount() {
    let theGrid = this.buildLevel(simpleLevelPlan);
    let theActors = this.randomActors(this.state.stage, theGrid);
    document.addEventListener("keydown", this.onKeyDown);
    this.setState({ grid: theGrid, actors: theActors });
  }

  onKeyDown(event) {
    if (this.state.gameStatus === "over") {
      console.log("You can't play, Game is OVER!");
    } else {
      if (event.keyCode === 38)
        this.aimAt(new Vector(0, -1));
      if (event.keyCode === 40)
        this.aimAt(new Vector(0, 1));
      if (event.keyCode === 37)
        this.aimAt(new Vector(-1, 0));
      if (event.keyCode === 39)
        this.aimAt(new Vector(1, 0));
    }
  }

  aimAt(vector) {
    const playerIndex = this.state.actors.findIndex(actor => actor.type === "player");
    const player = this.state.actors[playerIndex];
    const target = this.isEmpty(player.pos.plus(vector));
    if (target === true) {
      const newPos = player.pos.plus(vector);
      const newPlayer = player;
      newPlayer.pos = newPos;
      const newActors = this.state.actors;
      newActors.splice(playerIndex, 1, newPlayer);
      this.setState({ actors: newActors});
    } else if (target !== false && target > -1) {
      this.interactWith(target, player, playerIndex);
    }
  }

  interactWith(targetIndex, player, playerIndex) {
    const actor = this.state.actors[targetIndex];
    const type = actor.type;
    let newPlayer = player;
    let newActors = this.state.actors;
    switch (type) {
      case "healthItem":
        const health = actor.health;
        newPlayer.health = player.health + health;
        newPlayer.pos = actor.pos;
        newActors.splice(playerIndex, 1, newPlayer);
        newActors.splice(targetIndex, 1);
        this.setState({ actors: newActors });
        break;
      case "weapon":
        const weapon = actor.power;
        newPlayer.weapon = player.weapon + weapon;
        newPlayer.pos = actor.pos;
        newActors.splice(playerIndex, 1, newPlayer);
        newActors.splice(targetIndex, 1);
        this.setState({ actors: newActors });
        break;
      case "enemy":
        this.fight(actor, targetIndex, player, playerIndex, newPlayer, newActors);
        break;
      case "boss":
        this.fight(actor, targetIndex, player, playerIndex, newPlayer, newActors, true);
        break;
      case "end":
        this.endStage();
        break;
      default:
        break;
    }
  }

  endStage() {
    const enemiesLeft = this.state.actors.filter( actor => actor.type === "enemy" || actor.type === "boss");
    if (enemiesLeft && enemiesLeft.length > 0) {
      console.log("You didn't kill all the enemies of this stage yet.");
    } else {
      this.stageIsOver();
    }
  }

  stageIsOver() {
    console.log("Stage is over");
    this.setState({ gameStatus: "over" });
  }

  fight(actor, targetIndex, player, playerIndex, newPlayer, newActors, boss = false) {
    const enemyPower = actor.power;
    let enemyHealth = actor.health;
    // We punch the enemy
    enemyHealth -= player.weapon;
    if (enemyHealth <= 0) { // If enemy die
      // player gain XP
      newPlayer.xp += 10 * (player.level + 1);
      console.log("Enemy died - XP:",player.xp,"->",newPlayer.xp,"( +",10 * (player.level + 1),")");
      newActors.splice(playerIndex, 1, newPlayer);
      // enemy is removed
      newActors.splice(targetIndex, 1);
      if (boss) {
        console.log("You WIN!");
        this.setState({ actors: newActors, gameStatus : "over" });
      }
    } else { // if not
      console.log("You wounded the enemy - health:",actor.health,"->",enemyHealth,"( -",player.weapon,")");
      //enemy strike back
      newPlayer.health -= enemyPower;
      console.log("Enemy wound you - health:",player.health,"->",newPlayer.health,"( -",enemyPower,")");
      if (newPlayer.health <= 0) { // if player die
        this.gameOver();
      } else {
        let newEnemy = actor;
        newEnemy.health = enemyHealth;
        newActors.splice(playerIndex, 1, newPlayer);
        newActors.splice(targetIndex, 1, newEnemy);
      }
    }
    this.setState({ actors: newActors });
  }

  gameOver() {
    console.log("GAME OVER");
    this.setState({ gameStatus : "over" });
  }

  isEmpty(vector) {
    if (!this.isSpace(vector)) {
      return false;
    } else {
      return this.isUnoccupied(vector);
    }
  }

  isSpace(vector, grid = this.state.grid) {
    return grid[vector.y][vector.x] !== "wall";
  }

  isUnoccupied(vector) {
    const occupied = this.state.actors.findIndex( actor => actor.pos.x === vector.x && actor.pos.y === vector.y );
    return occupied > -1 ? occupied : true;
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
    const width = grid[0].length;
    const height = grid.length;
    const findXY = () => {
      let testX = Math.floor(Math.random() * width);
      let testY = Math.floor(Math.random() * height);
      if (this.isSpace(new Vector(testX,testY), grid) && this.isUnoccupied(new Vector(testX,testY), actors)) {
        return new Vector(testX, testY);
      } else {
        return findXY();
      }
    };
    return findXY();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>React Roguelike</h1>
          <Infos
            stage={this.state.stage}
            player={this.state.actors.find( actor => actor.type === "player")}
            gameStatus={this.state.gameStatus}
          />
        </div>
        <div className="App-body">
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

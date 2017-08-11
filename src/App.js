import React, { Component } from 'react';
import './App.css';
import Infos from './components/infos';
import Message from './components/message';
import Board from './components/board';
import { LevelPlans, dungeons, levels, weapons, Vector, Player } from './game_parameters';

const INITIAL_STATE = {
  width: 800,
  height: 600,
  scale: 20,
  grid: [],
  stage: 0,
  actors: [],
  message: "",
  gameStatus: null,
  finishDelay: 0,
  displayCover: true
};
const MESSAGES = {
  notFinished: "You must kill all the enemies before getting out.",
  nextStage: "Stage Clear ! Prepare for the next one...",
  gameOver: "GAME OVER! Game will restart...",
  win: "You win! Game will restart..."
};

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
      message: "",
      gameStatus: null,
      finishDelay: 0,
      displayCover: true
    };

    this.newGame = this.newGame.bind(this);
    this.buildLevel = this.buildLevel.bind(this);
    this.randomActors = this.randomActors.bind(this);
    this.findEmptyCell = this.findEmptyCell.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.interactWith = this.interactWith.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.endStage = this.endStage.bind(this);
    this.nextstage = this.nextstage.bind(this);
    this.switchCover = this.switchCover.bind(this);
    this.isEndPlace = this.isEndPlace.bind(this);
    this.youWin = this.youWin.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
    this.newGame();
  }

  componentDidUpdate() {
    switch (this.state.gameStatus) {
      case "nextStage":
        if (this.state.finishDelay > 0) {
          if (this.timeOutID)
            window.clearTimeout(this.timeoutID);
          this.timeoutID = window.setTimeout(() => this.setState({ finishDelay: this.state.finishDelay - 1, message: `${MESSAGES.nextStage} in ${this.state.finishDelay - 1}s` }), 1000);
        } else {
          this.nextstage();
        }
        break;
      case "gameOver":
        if (this.state.finishDelay > 0) {
          if (this.timeOutID)
            window.clearTimeout(this.timeoutID);
          this.timeoutID = window.setTimeout(() => this.setState({ finishDelay: this.state.finishDelay - 1, message: `${MESSAGES.gameOver} in ${this.state.finishDelay - 1}s` }), 1000);
        } else {
          this.newGame();
        }
        break;
      case "win":
        if (this.state.finishDelay > 0) {
          if (this.timeOutID)
            window.clearTimeout(this.timeoutID);
          this.timeoutID = window.setTimeout(() => this.setState({ finishDelay: this.state.finishDelay - 1, message: `${MESSAGES.win} in ${this.state.finishDelay - 1}s` }), 1000);
        } else {
          this.newGame();
        }
        break;
      default:
        break;
    }
  }

  newGame() {
    let theGrid = this.buildLevel(LevelPlans[this.state.stage]);
    let theActors = this.randomActors(this.state.stage, theGrid);
    this.setState({ ...INITIAL_STATE, grid: theGrid, actors: theActors });
  }

  onKeyDown(event) {
    if (this.state.gameStatus && this.state.gameStatus.length > 0) {
    } else {
      if (event.keyCode === 38)
        this.aimAt(new Vector(0, -1));
      if (event.keyCode === 40)
        this.aimAt(new Vector(0, 1));
      if (event.keyCode === 37)
        this.aimAt(new Vector(-1, 0));
      if (event.keyCode === 39)
        this.aimAt(new Vector(1, 0));
      if (event.keyCode === 76)
        this.switchCover();
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
    let newPlayer = new Player(new Vector(0,0));
    newPlayer = Object.assign(newPlayer, player);
    let newActors = [ ...this.state.actors ];
    switch (type) {
      case "healthItem":
        const health = actor.health;
        newPlayer.health = player.health + health;
        newPlayer.pos = actor.pos;
        newActors.splice(playerIndex, 1, newPlayer);
        newActors.splice(targetIndex, 1);
        this.setState({ message: `Health + ${health}`, actors: newActors });
        break;
      case "weapon":
        const weapon = actor.power;
        newPlayer.weapon = player.weapon + weapon;
        newPlayer.pos = actor.pos;
        newActors.splice(playerIndex, 1, newPlayer);
        newActors.splice(targetIndex, 1);
        this.setState({ message: `You got a new Weapon: ${weapons[Math.floor(newPlayer.weapon / 10)]}`, actors: newActors });
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
      this.setState({ message: MESSAGES.notFinished })
    } else {
      this.setState({ message: `${MESSAGES.nextStage} in 3s`, gameStatus: "nextStage", finishDelay: 3 });
    }
  }

  nextstage() {
    const player = this.state.actors.find( actor => actor.type === "player");
    const theGrid = this.buildLevel(LevelPlans[this.state.stage + 1]);
    let theActors = this.randomActors(this.state.stage + 1, theGrid);
    let newPlayerIndex = theActors.findIndex( actor => actor.type === "player");
    let newPlayer = theActors[newPlayerIndex];
    const newX = newPlayer.pos.x;
    const newY = newPlayer.pos.y;
    newPlayer = Object.assign(newPlayer, player);
    newPlayer.pos = new Vector(newX, newY);
    theActors.splice(newPlayerIndex, 1, newPlayer);
    theActors = theActors.map( actor => {
      if (actor.type === "enemy")
        actor.health = actor.health + (this.state.stage + 1) * 10;
      return actor;
    });
    this.setState({ message: "", stage: this.state.stage + 1, grid: theGrid, actors: theActors, gameStatus: null });
  }

  fight(actor, targetIndex, player, playerIndex, newPlayer, newActors, boss = false) {
    const enemyPower = Math.round(actor.power * ( 0.7 + Math.random() * 0.6));
    let enemyHealth = actor.health;
    // We punch the enemy
    const playerPower = Math.round((player.weapon + player.level * 3) * ( 0.7 + Math.random() * 0.6));
    enemyHealth -= playerPower;
    let message = "";
    if (enemyHealth <= 0) { // If enemy die
      // player gain XP
      const newXP = player.xp + 10 * (this.state.stage + 1);
      if (newXP < levels[player.level]) {
        newPlayer.xp = newXP;
      } else {
        newPlayer.level = player.level + 1;
        newPlayer.xp = newXP - levels[player.level];
      }
      message += `Enemy died! You have + ${newXP - player.xp} XP`;
      newActors.splice(playerIndex, 1, newPlayer);
      // enemy is removed
      newActors.splice(targetIndex, 1);
      if (boss) {
        this.youWin(newActors);
        return;
      }
    } else { // if not
      message += `Enemy's casualty: -${playerPower} (${enemyHealth} left)`;
      //enemy strike back
      newPlayer.health = player.health - enemyPower;
      message += `  /  You've been hit: -${enemyPower}`;
      if (newPlayer.health <= 0) { // if player die
        this.gameOver();
        return;
      } else {
        let newEnemy = actor;
        newEnemy.health = enemyHealth;
        newActors.splice(playerIndex, 1, newPlayer);
        newActors.splice(targetIndex, 1, newEnemy);
      }
    }
    this.setState({ actors: newActors, message: message });
  }

  youWin(newActors) {
    this.setState({ message: `${MESSAGES.win} in 10s`, actors: newActors, gameStatus : "win", finishDelay: 10 });
  }

  gameOver() {
    this.setState({ message: `${MESSAGES.gameOver} in 5s`, gameStatus : "gameOver", finishDelay: 5, stage: 0});
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

  randomActors(stage, grid) {
    let newActors = [];
    for (let prop in dungeons[stage]) {
      if (dungeons[stage].hasOwnProperty(prop)) {
        for (let p = 0 ; p < dungeons[stage][prop].amount ; p++) {
          const Actor = dungeons[stage][prop].build;
          const actorType = Actor.prototype.type;
          newActors.push(new Actor(this.findEmptyCell(grid, newActors, actorType), stage));
        }
      }
    }
    return newActors;
  }

  findEmptyCell(grid, actors, actorType) {
    const width = grid[0].length;
    const height = grid.length;
    let actorSize = actorType === "boss" ? new Vector(2,2) : undefined ;
    const findXY = () => {
      let testX = Math.floor(Math.random() * width);
      let testY = Math.floor(Math.random() * height);
      switch (actorType) {
        case "end":
          if (this.isEndPlace(new Vector(testX,testY), grid) && this.isUnoccupied(new Vector(testX,testY), actors)) {
            return new Vector(testX,testY);
          } else {
            return findXY();
          }
        default:
          if (this.isSpace(new Vector(testX,testY), grid, actorSize) && this.isUnoccupied(new Vector(testX,testY), actors)) {
            return new Vector(testX, testY);
          } else {
            return findXY();
          }
      }
    };
    return findXY();
  }

  isEmpty(vector) {
    if (!this.isSpace(vector)) {
      return false;
    } else {
      return this.isUnoccupied(vector);
    }
  }

  isSpace(vector, grid = this.state.grid, actorSize) {
    actorSize = actorSize || new Vector(1,1);
    if (actorSize.x === 1 && actorSize.y === 1)
      return grid[vector.y][vector.x] !== "wall";
    else {
      for ( let aX = vector.x ; aX <= vector.x + actorSize.x - 1 ; aX++ ) {
        for ( let aY = vector.y ; aY <= vector.y + actorSize.y - 1 ; aY++ ) {
          if (grid[aY][aX] === "wall")
            return false;
        }
      }
      return true;
    }
  }

  isUnoccupied(vector, actors = this.state.actors) {
    const occupied = actors.findIndex( actor => {
      if (actor.size.x === 1 && actor.size.y === 1)
        return actor.pos.x === vector.x && actor.pos.y === vector.y;
      else {
        for ( let aX = actor.pos.x ; aX <= actor.pos.x + actor.size.x - 1 ; aX++ ) {
          for ( let aY = actor.pos.y ; aY <= actor.pos.y + actor.size.y - 1 ; aY++ ) {
            if (aX === vector.x && aY === vector.y)
              return true;
          }
        }
        return false;
      }
    });
    return occupied > -1 ? occupied : true;
  }


  isEndPlace(vector, grid = this.state.grid) {
    for (let i = vector.y - 1 ; i <= vector.y + 1 ; i++) {
      if ( i >= 0 && i <= grid.length) {
        for (let j = vector.x - 1; j <= vector.x + 1; j++) {
          if (j >= 0 && j <= grid[0].length) {
            if (grid[i][j] === "wall") return false;
          }
        }
      }
    }
    return true;
  }

  switchCover() {
    this.setState({ displayCover: !this.state.displayCover });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>React Roguelike</h1>
          <p className="game-info">Beat the boss on stage 4 to win !</p>
          <Infos
            stage={this.state.stage}
            player={this.state.actors.find( actor => actor.type === "player")}
            gameStatus={this.state.gameStatus}
            switchCover={this.switchCover}
            displayCover={this.state.displayCover}
            levels={levels}
          />
          <Message
            message={this.state.message}
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
            displayCover={this.state.displayCover}
          />
        </div>
        <div className="App-footer">
          <div className="legend">
            <div className="square player"></div>You
          </div>
          <div className="legend">
            <div className="square enemy"></div>Enemy
          </div>
          <div className="legend">
            <div className="square weapon"></div>Weapon
          </div>
          <div className="legend">
            <div className="square healthItem"></div>Health
          </div>
          <div className="legend">
            <div className="square end"></div>Gate
          </div>
          <div className="legend boss">
            <div className="square boss"></div>Boss
          </div>
        </div>
      </div>
    );
  }
}

export default App;

export const weapons = ["Wood stick", "hammer", "cudgel", "axe", "sword", "dragon glass sword"];
export const LevelPlan = [
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

export const dungeons = {
  0: {
    enemy: { build: Enemy, amount: 4 },
    healthItem: { build: HealthItem, amount: 2 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1},
    end: { build: End, amount: 1}
  },
  1: {
    enemy: { build: Enemy, amount: 5 },
    healthItem: { build: HealthItem, amount: 3 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1},
    end: { build: End, amount: 1}
  },
  2: {
    enemy: { build: Enemy, amount: 6 },
    healthItem: { build: HealthItem, amount: 4 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1},
    end: { build: End, amount: 1}
  },
  3: {
    enemy: { build: Enemy, amount: 7 },
    healthItem: { build: HealthItem, amount: 5 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1},
    end: { build: End, amount: 1}
  },
  4: {
    enemy: { build: Enemy, amount: 8 },
    healthItem: { build: HealthItem, amount: 6 },
    boss: { build: Boss, amount: 1 },
    player: { build: Player, amount: 1},
    weapon: { build: Weapon, amount: 1},
  }
};

export const levels = [30,130,300,550,900,1500,2500];

export function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.times = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};

export function Player(pos) {
  this.pos = pos;
  this.size = new Vector(1,1);
  this.health = 100;
  this.xp = 0;
  this.level = 0;
  this.weapon = 5;
}
Player.prototype.type = "player";

export function Enemy(pos, stage) {
  this.pos = pos;
  this.size = new Vector(1, 1);
  this.health = 30;
  this.power = 10 + stage;
}
Enemy.prototype.type = "enemy";

export function Boss(pos) {
  this.pos = pos;
  this.size = new Vector(2, 2);
  this.health = 150;
  this.power = 40;
}
Boss.prototype.type = "boss";

export function HealthItem(pos) {
  this.pos = pos;
  this.size = new Vector(1, 1);
  this.health = 20;
}
HealthItem.prototype.type = "healthItem";

export function Weapon(pos) {
  this.pos = pos;
  this.size = new Vector(1, 1);
  this.power = 10;
}
Weapon.prototype.type = "weapon";

export function End(pos) {
  this.pos = pos;
  this.size = new Vector(1, 1);
}
End.prototype.type = "end";

/**
 * Character class
 * Encapsulates all information about a character
 */ 
class Character {

    name: string;

    speed: number;
    
    x: number;
    y: number;
    
    constructor(name: string, x: number, y: number, speed: number) {
        
        this.name = name;
        this.setSpeed(speed);
        this.moveTo(x, y);
    }
    
    setSpeed(speed: number) {
        if (speed > 0 ) {
        this.speed = speed;
        }
        else {
            throw new RangeError("Speed must be > 0");
        }
    }

    moveBy(dx: number, dy: number): void {
        this.x = this.x + dx;
        this.y = this.y + dy;
    }
    
    moveTo(x: number, y: number): void {
        if (x > 0) { this.x = x; } else { throw new RangeError("x value must be > 0"); }
        if (y > 0) { this.y = y; } else { throw new RangeError("y value must be > 0"); }
    }
    
}


class Guard extends Character {
    
    str: number;
    int: number;
    cha: number;
    
    constructor(name: string, x: number, y: number, speed: number,
                str: number, int: number, cha: number) {
        super(name, x, y, speed);
        this.setStr(str);
        this.setInt(int);
        this.setCha(cha);
    }
    
    
    setStr(str: number): void {
        if (str > 0) { this.str = str; } else { throw new RangeError("str value must be > 0"); }
    }
    
    setInt(int: number): void {
        if (int > 0) { this.int = int; } else { throw new RangeError("int value must be > 0"); }
    }
    
    setCha(cha: number): void {
        if (cha > 0) { this.cha = cha; } else { throw new RangeError("cha value must be > 0"); }
    }
}


function generateName(): string {
    
    let names: Array<string> = ["Bob", "Joe", "Bill", "Steve", "Eric", "Donald", "Jared", "Robert", "Paul"];
    
    return names[Math.floor(Math.random()*names.length)];
    
}



// Basic Character interface
// Encapsulates all information about a character
class Character {

    name: string;

    str: number;
    int: number;
    cha: number;

    x: number;
    y: number;
    
    constructor(name: string, str: number, int: number, cha: number, x: number, y: number) {

        this.name = name;
        
        if (str > 0) { this.str = str; } else { throw new RangeError("str value must be > 0"); }
        if (int > 0) { this.int = int; } else { throw new RangeError("int value must be > 0"); }
        if (cha > 0) { this.cha = cha; } else { throw new RangeError("cha value must be > 0"); }
        
        // TODO: Double check later 
        if (x > 0) { this.x = x; } else { throw new RangeError("x value must be > 0"); }
        if (y > 0) { this.y = y; } else { throw new RangeError("y value must be > 0"); }

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

class PC { 
    
}

function generateName(): string {
    
    let names: Array<string> = ["Bob", "Joe", "Bill", "Steve", "Eric", "Donald", "Jared", "Robert", "Paul"];

    return names[Math.floor(Math.random()*names.length)];

}

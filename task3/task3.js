const crypto = require('crypto');
const Table = require('cli-table');

class MoveGenerator {
    generateMove() {
        return Math.floor(Math.random() * 5) + 1;
    }
}
class KeyGenerator {
    generateKey() {
        return crypto.randomBytes(32).toString('hex');
    }
}
class HmacCalculator {
    calculateHmac(move, key) {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(move.toString());
        return hmac.digest('hex');
    }
}
class Rules {
    constructor() {
         this.menu = {
            '1': 'Rock',
            '2': 'Paper',
            '3': 'Scissors',
            '4': 'Lizard',
            '5': 'Spock',
            '0': 'exit',
            '?': 'help'
        };

    }
    winner(playerMove, computerMove) {
        const dict = {
            1: ['Scissors', 'Lizard'],
            2: ['Rock', 'Spock'],
            3: ['Paper', 'Lizard'],
            4: ['Paper', 'Spock'],
            5: ['Rock', 'Scissors']
        };

        if (playerMove == parseInt(computerMove)) {
            return "Draw";
        } else if (dict[playerMove].includes(this.menu[computerMove])) {
            return "You Won";
        } else {
            return "You Lose";
        }
    }
}
class HelpMenu {
    displayHelp() {
        const table = new Table({
            head: ['PC Moves', 'Rock', 'Paper', 'Scissors'],
            colWidths: [10, 10, 10, 10]
        });

        table.push(
            ['Rock', 'Draw', 'Lose', 'Win'],
            ['Paper', 'Win', 'Draw', 'Lose'],
            ['Scissors', 'Lose', 'Win', 'Draw']
        );

        console.log(table.toString());
    }
}



class Main {
    constructor() {
        this.key = new KeyGenerator();
        this.hmac = new HmacCalculator();
        this.helpMenu = new HelpMenu();
        this.rules = new Rules();
        this.moveGenerator = new MoveGenerator();
    }

     play() {
        const key = this.key.generateKey();
        const menu = this.rules.menu;
        const compMove = this.moveGenerator.generateMove();
        const hmac = this.hmac.calculateHmac(menu[compMove], key);
        console.log('HMAC:', hmac);

        Object.entries(menu).forEach(([key, value]) => {
            console.log(`${key} - ${value.toLowerCase()}`);
        });

        const prompt = require("prompt-sync")();
        const move = prompt(`your move: `);
        console.log(`your move was: ${menu[move]}`)
        if (move === '0') {
            console.log("bye")
            return;
        } else if (move === '?') {
            this.helpMenu.displayHelp();
        }else if (menu.hasOwnProperty(move.toString())) {
            const result = this.rules.winner(move, compMove);
            console.log('Computer move:', menu[compMove]);
            console.log('HMAC Key is:', key);

            console.log('Result:', result);
        } else {
            console.log("please choose from menu")
        }
        this.play()}
}


let main = new Main();
main.play()
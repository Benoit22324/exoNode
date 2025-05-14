import dotenv from "dotenv";
import { stdin, stdout } from "node:process";
import readline from "node:readline";

dotenv.config("./.env");

const { APP_ROCK, APP_PAPER, APP_SCISSOR } = process.env;

const commands = [
    {
        name: "start",
        description: "Lance une partie de Chifumi."
    },
    {
        name: "restart",
        description: "Relance une partie de Chifumi avec le même nombre de manche."
    },
    {
        name: "reset",
        description: "Réinitialisation des scores."
    }
]

const rl = readline.createInterface({
    input: stdin,
    output: stdout,
    terminal: false
})

rl.setPrompt("User | ");
rl.prompt();

let score1 = 0;
let score2 = 0;
let previousRoundsNumber = 0;
let history = [];

rl.on("line", (text) => {
    const command = text.trim();

    switch(command) {
        case "help":
            console.table(commands);
            break;
        case "start":
            rl.question("Combien de manche ? ", (rounds) => {
                previousRoundsNumber = Number(rounds);
                game(Number(rounds));
                return rl.prompt();
            })

            break;
        case "restart":
            if (previousRoundsNumber === 0) {
                console.log("Vous n'avez pas encore lancé le jeu.");
                break;
            }

            game(previousRoundsNumber);
            break;
        case "history":
            if (history.length < 1) {
                console.log("Vous n'avez pas encore d'historique.");
                break;
            }
            console.table(history);
            break;
        case "reset":
            score1 = 0;
            score2 = 0;

            console.log("Les scores ont été réinitialisé !");
            break;
        case "clear":
            history = [];

            console.log("Historique réinitialisé !");
            break;
        default:
            console.log("Commande Inconnue. Écrivez \"help\" pour voir les commandes disponibles.");
            break;
    }

    rl.prompt();
})

const game = (maxRound) => {
    let currentRound = 1;

    while(currentRound <= maxRound) {
        const player1 = rps();
        const player2 = rps();

        console.log(`${player1.emoji}  vs  ${player2.emoji}`);

        if (player1.choosed === player2.choosed) {
            console.log(`Égalité à la manche ${currentRound} ! `);
        }
        else if (player1.choosed === "rock" && player2.choosed === "paper") {
            score2++;
            console.log(`Joueur 2 gagne la manche ${currentRound} ! `);
        }
        else if (player1.choosed === "rock" && player2.choosed === "scissor") {
            score1++;
            console.log(`Joueur 1 gagne la manche ${currentRound} ! `);
        }
        else if (player1.choosed === "paper" && player2.choosed === "rock") {
            score1++;
            console.log(`Joueur 1 gagne la manche ${currentRound} ! `);
        }
        else if (player1.choosed === "paper" && player2.choosed === "scissor") {
            score2++;
            console.log(`Joueur 2 gagne la manche ${currentRound} ! `);
        }
        else if (player1.choosed === "scissor" && player2.choosed === "rock") {
            score2++;
            console.log(`Joueur 2 gagne la manche ${currentRound} ! `);
        }
        else if (player1.choosed === "scissor" && player2.choosed === "paper") {
            score1++;
            console.log(`Joueur 1 gagne la manche ${currentRound} ! `);
        }

        console.log(`Score actuel: J1 - ${score1} | J2 - ${score2}\n`);

        currentRound++;
    }

    console.log(`Score final en ${maxRound} manche${maxRound > 1 ? "s" : ""}: J1 - ${score1} | J2 - ${score2}`);

    history.push({"Joueur 1": score1, "Joueur 2": score2, "Gagnant": score1 === score2 ? "Égalité" : score1 > score2 ? "Joueur 1" : "Joueur 2"});

    if (score1 === score2) return console.log("Égalité des deux Joueurs.");
    else if (score1 > score2) return console.log("Le Joueur 1 gagne la partie !");
    else if (score1 < score2) return console.log("Le Joueur 2 gagne la partie !");
}

const rps = () => {
    const rdm = Math.floor(Math.random() * 3) + 1;

    switch(rdm) {
        case 1:
            return {choosed: "rock", emoji: APP_ROCK};
        case 2:
            return {choosed: "paper", emoji: APP_PAPER};
        case 3:
            return {choosed: "scissor", emoji: APP_SCISSOR};
    }
}
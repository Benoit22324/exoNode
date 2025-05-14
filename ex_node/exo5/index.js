import fs from "node:fs";
import { stdin, stdout } from "node:process";
import readline from "node:readline"
import os from "node:os"
import dotenv from "dotenv"

dotenv.config("./.env");

const filePath = "./data/student.json";
let studentList;
let studentAverageList;

const commands = [
	{
		name: "list",
		description: "Liste tout les élèves."
	},
	{
		name: 'find',
		description: "Cherche puis affiche les infos d'un élève si il existe."
	},
	{
		name: 'more',
		description: "Filtre les élèves en fonction de leur moyenne"
	},
    {
        name: 'add',
        description: "Ajoute une note à un élève"
    },
    {
        name: 'mention',
        description: "Ajoute une mention à un élève"
    }
]

const rl = readline.createInterface({
    input: stdin,
    output: stdout,
    terminal: false
})

try {
    studentList = JSON.parse(fs.readFileSync(filePath, {encoding: "utf8"}));

    studentAverageList = studentList.map((student) => {
        const total = student.notes.reduce((total, note) => total += note, 0);
        const average = Math.floor(total / student.notes.length * 100) / 100;

        return {...student, average}
    })
} catch(e) {
    console.error(e)
}

rl.setPrompt(`${os.hostname} | `)
rl.prompt()

rl.on("line", (text) => {
    const command = text.trim();

    try {

        if (command === "help") {
            console.table(commands);
            return rl.prompt()
        }

        else if (command === "list") {
            console.table(studentList);
            return rl.prompt()
        }

        else if (command === "find") {
            rl.question("Quelle élève cherchez-vous ? ", (name) => {
                const searchedStudent = studentList.filter((student) => {
                    const splitName = student.name.split(" ");

                    if (splitName[0] === name.trim().toUpperCase() || splitName[1] === name.trim().toUpperCase()) return student
                });

                if (searchedStudent.length < 1) {
                    console.log("Élève Introuvable dans la liste.");
                    return rl.prompt()
                }

                console.table(searchedStudent);
                return rl.prompt()
            })
        }

        else if (command === "more") {
            rl.question("Au dessus de combien de moyenne ? ", (average) => {
                const averageBar = Number(average.trim());

                if (isNaN(averageBar)) {
                    console.log("Veuillez saisir un nombre.");
                    return rl.prompt()
                }

                if (averageBar > 19 || averageBar < 0) {
                    console.log("Veuillez saisir un nombre entre 0 et 19.");
                    return rl.prompt()
                }

                const reachedAverage = studentAverageList.filter((student) => student.average > averageBar);

                console.table(reachedAverage);
                return rl.prompt()
            })
        }

        else if (command === "add") {
            rl.question("A qui voulez-vous ajouter une note ? ", (name) => {
                const searchedStudent = studentList.filter((student) => {
                    const splitName = student.name.split(" ");

                    if (splitName[0] === name.trim().toUpperCase() || splitName[1] === name.trim().toUpperCase()) return student
                });

                if (searchedStudent.length < 1) {
                    console.log("Élève Introuvable dans la liste.");
                    return rl.prompt()
                }

                rl.question("Quelle note ? ", (noteAnswer) => {
                    const note = parseFloat(noteAnswer.trim());

                    if (isNaN(note)) {
                        console.log("Veuillez saisir un nombre.");
                        return rl.prompt()
                    }

                    if (note > 20 || note < 0) {
                        console.log("Veuillez saisir un nombre entre 0 et 20.");
                        return rl.prompt()
                    }

                    studentList.forEach((student) => {
                        if (student.name === searchedStudent[0].name) {
                            student.notes = [...student.notes, note];
                        };
                    });

                    console.log(`Note de ${note} ajouté à ${searchedStudent[0].name}`)
                    return rl.prompt()
                })
            })
        }

        else if (command === "mention") {
            rl.question("A qui voulez vous ajouter une mention ? ", (name) => {
                const searchedStudent = studentList.filter((student) => {
                    const splitName = student.name.split(" ");

                    if (splitName[0] === name.trim().toUpperCase() || splitName[1] === name.trim().toUpperCase()) return student
                });

                if (searchedStudent.length < 1) {
                    console.log("Élève Introuvable dans la liste.");
                    return rl.prompt()
                }

                const average = studentAverageList.filter((student) => student.name === searchedStudent[0].name)[0].average;
                let mention = null;

                if(average > 10 && average <= 12) mention = process.env.MENTION_P;
                else if(average > 12 && average <= 14) mention = process.env.MENTION_AB;
                else if(average > 14 && average <= 16) mention = process.env.MENTION_B;
                else if(average > 16 && average <= 20) mention = process.env.MENTION_TB;

                if (mention) {
                    studentList.forEach((student) => {
                        if (student.name === searchedStudent[0].name) {
                            student.mention = mention;
                        };
                    });

                    console.log(`${searchedStudent[0].name} a eu une mention ${mention} avec une moyenne de ${average}.`)
                    return rl.prompt()
                }

                console.log(`${searchedStudent[0].name} n'a pas pu avoir de mention à cause d'une moyenne trop faible.`);
                return rl.prompt()
            })
        }

        else console.log("Commande Inconnu. Écrivez \"help\" pour voir les commandes disponibles.");

        rl.prompt()
    } catch(e) {
        console.error(e)
    }
})
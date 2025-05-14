const fs = require('node:fs')

const filePath = "./data/student.json";

const commands = [
	{
		name: "list",
		description: "Liste tout les élèves."
	},
	{
		name: 'find <string>',
		description: "Cherche puis affiche les infos d'un élève si il existe."
	},
	{
		name: 'more <number>',
		description: "Filtre les élèves en fonction de leur moyenne"
	}
]


process.stdin.on("data", (chunk) => {
	const data = chunk.toString().trim();
	const text = data.replace("\r?\n", '');

    try {
        const studentList = JSON.parse(fs.readFileSync(filePath, {encoding: "utf8"}));

        const studentAverageList = studentList.map((student) => {
            const total = student.notes.reduce((total, note) => total += note, 0);
            const average = Math.floor(total / student.notes.length * 100) / 100;

            return {...student, average}
        })

        if (text === "help") {
            return console.table(commands);
        }

        if (text === "list") {
            return console.table(studentList);
        }

        const splitText = text.split(" ");

        if (splitText[0] === "find") {
            if (!splitText[1]) return console.log("Veuillez saisir le nom d'un élève.");

            const searchedStudent = studentList.filter((student) => {
                const splitName = student.name.split(" ");

                if (splitName[0] === splitText[1].toUpperCase() || splitName[1] === splitText[1].toUpperCase()) return student
            });

            if (searchedStudent.length < 1) return console.log("Élève Introuvable dans la liste.");

            return console.table(searchedStudent)
        }

        if (splitText[0] === "more") {
            const averageBar = Number(splitText[1]);

            if (!splitText[1] || isNaN(averageBar)) return console.log("Veuillez saisir un chiffre.");

            const reachedAverage = studentAverageList.filter((student) => student.average > averageBar);

            return console.table(reachedAverage);
        }

        return console.log("Commande Inconnu. Écrivez \"help\" pour voir les commandes disponibles.");
    } catch(e) {
        console.error(e);
    }
})
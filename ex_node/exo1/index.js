const rdmNumber = Math.floor(Math.random() * 100) + 1;
let userTry = 10;

console.log(`Devinez le chiffre généré entre 1 et 100 ! Vous avez ${userTry} tentative${userTry > 1 ? "s" : ""}.`);

process.stdin.on("data", (chunk) => {
    const guess = Number(chunk.toString().replace("\n", "").trim());
    const spacingBetween = guess - rdmNumber;

    if (isNaN(guess) || guess === 0 || guess > 100) return console.log("Vous devez saisir un chiffre entre 1 et 100.");

    if (guess > rdmNumber || guess < rdmNumber) {
        userTry--;

        if (userTry === 0) {
            console.log(`Vous avez perdu. Le chiffre était ${rdmNumber}.`);
            process.exit(0);
        }

        if (spacingBetween > 10) return console.log(`Trop Haut ! Plus que ${userTry} tentative${userTry > 1 ? "s" : ""}.`);
        if (spacingBetween < -10) return console.log(`Trop Bas ! Plus que ${userTry} tentative${userTry > 1 ? "s" : ""}.`);
        if (spacingBetween <= 10 && spacingBetween > 0) return console.log(`Vous êtes proches mais un peu Haut ! Plus que ${userTry} tentative${userTry > 1 ? "s" : ""}.`);
        if (spacingBetween >= -10 && spacingBetween < 0) return console.log(`Vous êtes proches mais un peu Bas ! Plus que ${userTry} tentative${userTry > 1 ? "s" : ""}.`);
    }

    if (guess === rdmNumber && spacingBetween === 0) {
        console.log("Félicitation ! Vous avez réussi à deviner le chiffre !");
        process.exit(0);
    }
})
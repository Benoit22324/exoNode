import http from "node:http";
import { shuffle } from "./utils/shuffle.js";
import querystring from "node:querystring";

const users = [
    {
        nom: "Alice",
        email: "alice.dupont@example.com",
        role: "admin"
    },
    {
        nom: "Jean",
        email: "jean.martin@example.com",
        role: "utilisateur"
    },
    {
        nom: "Sophie",
        email: "sophie.lambert@example.com",
        role: "modérateur"
    },
    {
        nom: "Lucas",
        email: "lucas.moreau@example.com",
        role: "utilisateur"
    },
    {
        nom: "Emma",
        email: "emma.lefevre@example.com",
        role: "admin"
    },
    {
        nom: "Hugo",
        email: "hugo.bernard@example.com",
        role: "utilisateur"
    },
    {
        nom: "Chloé",
        email: "chloe.richard@example.com",
        role: "modérateur"
    },
    {
        nom: "Thomas",
        email: "thomas.garcia@example.com",
        role: "utilisateur"
    },
    {
        nom: "Manon",
        email: "manon.petit@example.com",
        role: "admin"
    },
    {
        nom: "Nathan",
        email: "nathan.robert@example.com",
        role: "utilisateur"
    }
];

let currentList = [...users];

const server = http.createServer((req, res) => {
    const url = req.url.replace("/", "");

    if (url === "favicon.ico") {
        res.writeHead(200, {
            "content-type": "image/x-icon"
        });
        res.end();
        return
    }

    if (url === "shuffle") {
        currentList = shuffle(currentList);

        res.writeHead(302, {
            "location": "/"
        });
        res.end();
        return
    }

    if (url === "form" && req.method === "GET") {
        res.writeHead(200, {
            "content-type": "text/html; charset=utf8"
        });
        res.end(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Form Page</title>
                </head>
                <body>
                    <div>
                        <a href="/">Home</a>
                        <a href="/shuffle">Shuffle</a>
                        <a href="/form">Formulaire</a>
                    </div>
                    <h1>Ajouter un utilisateur</h1>
                    <form method="post">
                        <label>Nom:</label>
                        <input name="name" type="text">
                        <label>email:</label>
                        <input name="email" type="email">
                        <input type="submit">
                    </form>
                </body>
            </html>
        `);
        return
    }

    if (url === "form" && req.method === "POST") {
        let body = "";
		req.on('data', (chunk) => {
			body += chunk.toString()
		})
		req.on("end", () => {
			const data = querystring.parse(body)
			
			if (!data.name || !data.email || data.name.trim() === "" || data.email.trim() === "") {
				res.writeHead(401, {"Content-type" : "text/plain"})
				res.end("Les champs nom et email ne peuvent pas être vide")
				return
			}

            const newUser = {
                nom: data.name,
                email: data.email,
                role: "utilisateur"
            }

			currentList.push(newUser)
			res.writeHead(302, {
				"Location": "/"
			})
			res.end()
			return
		})
		return
    }

    const selectedUser = currentList.find((user) => user.nom === url);

    if (selectedUser && selectedUser.length !== 0) {
        res.writeHead(200, {
            "content-type": "text/html; charset=utf8"
        });
        res.end(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>User Info Page</title>
                </head>
                <body>
                    <div>
                        <a href="/">Home</a>
                        <a href="/shuffle">Shuffle</a>
                        <a href="/form">Formulaire</a>
                    </div>
                    <h1>User Info</h1>
                    <p>Nom: ${selectedUser.nom}</p>
                    <p>Email: ${selectedUser.email}</p>
                    <p>Rôle: ${selectedUser.role}</p>
                </body>
            </html>
        `);
        return
    }

    res.writeHead(200, {
        "content-type": "text/html; charset=utf8"
    });
    res.end(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Home Page</title>
            </head>
            <body>
                <div>
                    <a href="/">Home</a>
                    <a href="/shuffle">Shuffle</a>
                    <a href="/form">Formulaire</a>
                </div>
                <h1>User List:</h1>
                <ul>
                    ${
                        currentList.map((user) => `<li><a href="/${user.nom}">${user.nom}</a></li>`).join("")
                    }
                </ul>
            </body>
        </html>
    `);
});

server.listen(8000, "localhost", () => {
    console.log(`Serveur allumé sur le port 8000`);
})
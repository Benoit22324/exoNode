import http from "node:http";
import { shuffle } from "./utils/shuffle.js";

const users = [
    'Alan',
    'Sophie',
    'Bernard',
    'Elie'
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
        res.writeHead(301, {
            "location": "/"
        });
        res.end();
        return
    }

    res.writeHead(200, {
        "content-type": "text/html"
    });
    res.end(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Home Page</title>
            </head>
            <body>
                <h1>User List:</h1>
                <ul>
                    ${
                        currentList.map((name) => `<li>${name}</li>`).join("")
                    }
                </ul>
            </body>
        </html>
    `);
});

server.listen(8000, "localhost", () => {
    console.log(`Serveur allumé sur le port 8000`);
})
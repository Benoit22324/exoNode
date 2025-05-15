import http from "node:http";
import pug from "pug";
import path from "node:path";
import fs from "node:fs";
import querystring from "node:querystring"

const menuItems = [
    { path: '/', title: 'Home', isActive: true },
    { path: '/about-me', title: 'About', isActive: false },
    { path: '/references', title: 'References', isActive: false },
    { path: '/contact-me', title: 'Contact', isActive: false },
];

const requests = JSON.parse(fs.readFileSync(path.join("src", "data", "requests.json")));

let requestList = [...requests];

const server = http.createServer((req, res) => {
    const url = req.url.replace("/", "");

    if (url === "favicon.ico") {
        res.writeHead(200, {
			"content-type": "image/x-icon"
		})
		res.end()
		return
    }

    if (url === "contact-me" && req.method === "GET") {
        res.writeHead(200, {
            "content-type": "text/html"
        })
        pug.renderFile(path.join("src", "view", "contact.pug"), {pretty: true, menuItems}, (err, html) => {
            if (err) throw err
            res.end(html)
        })
        return
    }

    if (url === "contact-me" && req.method === "POST") {
        let body = "";
        req.on('data', (chunk) => {
            body += chunk.toString()
        })
        req.on("end", () => {
            const data = querystring.parse(body)
            
            if (!data.email || !data.message || data.email.trim() === "" || data.message.trim() === "") {
                res.writeHead(401, {"Content-type" : "text/plain"})
                res.end("Les champs email et message ne peuvent pas être vide")
                return
            }

            const newRequest = {
                email: data.email,
                message: data.message.trim()
            }

            requestList.push(newRequest)
            res.writeHead(302, {
                "Location": "/"
            })
            res.end()
            return
        })
        return
    }

    if (url === "" && requestList.length > requests.length) {
        fs.writeFileSync(path.join("src", "data", "requests.json"), JSON.stringify(requestList));
        res.writeHead(200, {
            "content-type": "text/html"
        })
        pug.renderFile(path.join("src", "view", "home.pug"), {pretty: true, menuItems, newRequest: true}, (err, html) => {
            if (err) throw err
            res.end(html)
        })
        return
    }

    res.writeHead(200, {
        "content-type": "text/html"
    })
    pug.renderFile(path.join("src", "view", "home.pug"), {pretty: true, menuItems, newRequest: false}, (err, html) => {
        if (err) throw err
        res.end(html)
    })
})

server.listen(8000, "localhost", () => {
    console.log("Serveur lancé !")
})
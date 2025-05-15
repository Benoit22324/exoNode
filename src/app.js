import pug from "pug";
import path from "node:path";

pug.renderFile(path.join("src", "view", "admin.pug"), { isAdmin: true }, (err, html) => {
    console.log(html)
});

import pug from "pug";
import path from "node:path";

const loggedUser = {
    name: {
        first: 'Jean',
        last: 'Dupont',
    },
    age: 36,
    birthdate: new Date('1986-04-18'),
    location: {
        zipcode: '77420',
        city: 'Champs-sur-Marne',
    },
    isAdmin: true
};

const compile = pug.compileFile(path.join("src", "view", "user.pug"), {pretty: true});
console.log(compile(loggedUser))

// pug.renderFile(path.join("src", "view", "admin.pug"), { isAdmin: true }, (err, html) => {
//     console.log(html)
// });

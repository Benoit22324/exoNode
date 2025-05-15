import pug from "pug";
import path from "node:path";

const menuItems = [
    { path: '/', title: 'Home', isActive: true },
    { path: '/about-me', title: 'About', isActive: false },
    { path: '/references', title: 'References', isActive: false },
    { path: '/contact-me', title: 'Contact', isActive: false },
];

const compile = pug.compileFile(path.join("src", "view", "home.pug"), {pretty: true})
console.log(compile({menuItems}))
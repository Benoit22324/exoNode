// const { calculateTTC } = require("./utils.mjs")
import { calculateTTC } from "./utils.mjs";

const priceHT = [
    { name : "Apple", priceHT : 1.0, priceTTC : null },
    { name : "Orange", priceHT : 1.2, priceTTC : null },
    { name : "Rasberry", priceHT : 2.5, priceTTC : null },
];

const products = priceHT.map((product) => {
    return {...product, priceTTC: calculateTTC(product.priceHT)}
})

console.table(products)
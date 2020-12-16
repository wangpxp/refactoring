const fs = require('fs');
const Print = require('./print_invoices_re.js');

let invoice = JSON.parse(fs.readFileSync('./invoices.json'));
let plays = JSON.parse(fs.readFileSync('./plays.json'));

let result = Print(invoice, plays);
console.log(result);


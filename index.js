let logger = require('./scripts/logger.js');

let colors = require('colors')
let { validateInput, filterInput } = require('./scripts/prompter.js')
let Prompter = require('./scripts/prompter.js')
let Server = require('./scripts/server.js')

const beginning = [{
    type: 'list',
    name: 'dowhat',
    message: 'What would you like to do?', 
    choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        " add an employee",
        "update an employee role",]
}
]

let prompt = new Prompter(beginning, ()=>{});

prompt.startPrompt();

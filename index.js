let { log, warn, info, error } = new (require('./scripts/logger.js'));

let colors = require('colors')
let { validateInput, filterInput } = require('./scripts/prompter.js')
let Prompter = require('./scripts/prompter.js')
let Server = require('./scripts/server.js')
// it's easy afffff

// log is the most robust function logger has and using it in your js is as easy as
log("Hi there! I'm Logger!", 'brightGreen', 'bgBrightBlue');
// this will print 'Hi There! I'm logger!' with yellow text and a green background

info('I set info messages to have a grey background and white text!');

warn('I set warn messages to have a white background and red text!');

error('I set error messages to have a yellow background and red text!');

log('I hope I can help you debug CLI someday!', 'green');
log('To install, run [npm install colors] in your project and add logger to your file structure.\nHappy logging!', 'brightYellow', 'bgBlue');

const beginChoices = [
    "view all departments",
    "view all roles",
    "view all employees",
    "add a department",
    "add a role",
    "add an employee",
    "update an employee role",
    "quit"];

const beginning = [{
    type: 'list',
    name: 'dowhat',
    message: 'What would you like to do?',
    choices: beginChoices,
}
]

let addRoleQuestions = [
    { 
        type: 'input', 
    name: 'role', 
    message: 'Name of new role?' 
},
{ 
    type: 'input', 
name: 'salary', 
message: 'How much should this peon be paid?' 
},
{ 
    type: 'list', 
name: 'department', 
message: 'What department?',

}
]

const tester = async (sql) => {
    const test = await server.pool.query(sql, (err, { rows }) => {
        if (err) {
            error(err);
            //   return err
        }
        //   log(sql, 'magenta');
        // log(rows, 'red');
        let rowString = JSON.stringify(rows);
        //   return rowString;
        //_selectAllFromTable(this, sql);
    });
    return test;
}

const handleBegin = (answer) => {
    warn('handlign answer')
    answer = answer.dowhat;
    if (answer.department) server.addDepartment(answer.department);
    log(['answer:', answer], 'green');

    const ind = beginChoices.indexOf(answer);
    let sql;
    switch (ind) {
        case 0:
            sql = 'SELECT * FROM department';

            server.selectAllFromTable('department')

            break;
        case 1:
            sql = 'SELECT * FROM role';
            /*select  title, salary, department.name as department from role join department on role.department_id = department.id;*/
            server.selectAndJoin('role.id, title, salary, department.name as department', 'role', 'department', 'role.department_id = department.id');
            break;
        case 2:
            //SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS departments FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;

            server.getEmployees();
            break;

        case 3:
            prompt.next({ type: 'input', name: 'department', message: 'Name of new department?' }, (answer) => {
                server.addDepartment(answer.department);
            })
            break;
        case 4:
            server.pool.query(`select * from department`, (err, { rows }) => {
                addRoleQuestions[2].choices =rows.map(({ id, name }) => ({
                    name: `${name}`,
                    value: id
                  }))
                if(err) error(err);
                prompt.next(addRoleQuestions, (answer)=> {
                   
                log(answer.department, 'white');
                    let role = {
                        name: answer.role,
                        salary: answer.salary,
                        department: Math.floor(answer.department)
                    };

                    server.addRole(role).then(log('role added!', 'magenta'));

                })
            })
            break;
        case 5:
            break;
        case 6:
            break;
        case 7:
            break;
        default:
            break;
    }
};

let prompt = new Prompter(beginning, handleBegin);
let server = new Server('employees');
//server.connectToDB('Employees');
/*
setTimeout(() => {
    server.insert('DICK BALLS');

    //  console.log(server.selectAllFromTable('DICK BALLS'));
}, 1000)*/

setTimeout(() => {
    prompt.startPrompt();
}, 2000);
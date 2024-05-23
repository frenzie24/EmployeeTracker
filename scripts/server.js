const express = require('express');
const { default: inquirer } = require('inquirer');
const { log, info, warn, error } = new (require('./logger.js'))
// Import and require Pool (node-postgres)
// We'll be creating a Connection Pool. Read up on the benefits here: https://node-postgres.com/features/pooling
const { Pool } = require('pg');

class Server {
    constructor(database, prompt) {
        this.PORT = process.env.PORT || 3001;
        this.app = express();
        this.prompt = prompt;
        // this.router = new Router();

        // Express middleware
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use((req, res) => {
            res.status(404).end();
        });

        this.app.listen(this.PORT, () => {
            console.log(`Server running on port ${this.PORT}`);
        });



        this.database = database;
        this.pool = new Pool(
            {
                user: 'postgres',
                password: 'rootroot',
                host: 'localhost',
                database: database
            },
        )

        this.pool.connect().then(() => {
            log([`Connected to the ${database} database.`, 'Ready'], 'yellow');

            this.startPrompt();

        });

    }
    connectToDB = (database) => {
        //set the server obj database to the passsed database param
        this.database = database;
        this.pool = new Pool(
            {
                user: 'postgres',
                password: 'rootroot',
                host: 'localhost',
                database: database
            },
        )

        this.pool.connect().then(() => {
            console.log(`Connected to the ${database} database.`)

        });
    }

    selectAndJoin = async (SELECTION, TABLE1, TABLE2, JOIN) => {

        const sql = `SELECT ${SELECTION} FROM ${TABLE1} INNER JOIN ${TABLE2} ON ${JOIN}`;

        await this.pool.query(sql, (err, { rows }) => {
            console.table(rows);
            this.startPrompt();
        })
    }

    addDepartment = async () => {
        await this.prompt.next({ type: 'input', name: 'department', message: 'Name of new department?' }, (answer) => {
            log(answer.department)
            this.pool.query(`INSERT INTO department (name) VALUES ($1);`, [answer.department], (err) => { if (err) error(err) });
            log('Department added!', 'magenta');
            this.startPrompt();
        })
    }

    addRole = async (questions) => {
        await this.pool.query(`select * from department`, (err, { rows }) => {
            questions[2].choices = rows.map(({ id, name }) => ({
                name: `${name}`,
                value: id
            }))
            if (err) error(err);
            this.prompt.next(questions, (answer) => {

                let role = {
                    name: answer.role,
                    salary: answer.salary,
                    department: Math.floor(answer.department)
                };

                log([`Inserting new role: ${role.name}`, `with a salary of: ${role.salary}`, `into department with id: ${role.department}`], ['red', 'white']);
                const depID = role.department;
                this.pool.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);`, [role.name, role.salary, depID]);
                log('Role added!', 'magenta');

                this.startPrompt();

            })
        })
    }

    addEmployee = async (questions) => {
        let employees;
        await this.pool.query(`select * from employee`, (err, { rows }) => {
            employees = rows;
            questions[3].choices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            this.pool.query('select * from role', (err, { rows }) => {
                if (err) error(err);
                questions[2].choices = rows.map(({ id, title }) => ({
                    name: `${title}`,
                    value: id
                }));
                if (err) error(err);
                this.prompt.next(questions, (answer) => {


                    let employee = {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: answer.role,
                        manager_id: answer.manager
                    };
                    log(['adding a new employee', employee], 'blue');
                    this.pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);`, [answer.firstName, answer.lastName, answer.role, answer.manager]);
                    log('Employee added!', 'magenta');
                    this.startPrompt();

                })
            })


        })
    }

    updateEmployee = async (questions) => {
        let employees;
        let roles;
        await this.pool.query("SELECT * FROM employee", (err, { rows }) => {
            employees = rows;
            questions[0].choices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            questions[0].choices.push(new inquirer.sep)
            this.pool.query("SELECT * FROM role", (err, { rows }) => {

                questions[1].choices = rows.map(({ id, title }) => ({
                    name: `${title}`,
                    value: id
                }));
                this.prompt.next(questions, (answer) => {


                    this.pool.query(`UPDATE employee SET role_id = ${answer.role} WHERE id = ${answer.employee}`);

                    this.startPrompt();
                })
            });
        });

    }

    getEmployees = async () => {
        this.pool.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id",
            (err, { rows }) => {
                console.table(rows);
                this.startPrompt();
            });
    }

    startPrompt = async () => {
        
            log('Taking you back to main menu', 'green')
            this.prompt.startPrompt();
       
    }

    selectAllFromTable = async (TABLE) => {
        const sql = `SELECT * FROM ${TABLE}`;
        let rowString = this.pool.query(sql, (err, { rows }) => {
            if (err) {
                error(err);
                return err
            }
            //log(sql, 'magenta');
            console.table(rows);
            this.startPrompt();
            //  return rows;
            //_selectAllFromTable(this, sql);
        });


    }
}

module.exports = Server;
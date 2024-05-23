const express = require('express');
const { log, info, warn, error } = new (require('./logger.js'))
// Import and require Pool (node-postgres)
// We'll be creating a Connection Pool. Read up on the benefits here: https://node-postgres.com/features/pooling
const { Pool } = require('pg');

/*const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
*/
// Connect to database
class  Server  {
    constructor(database) {
        this.PORT = process.env.PORT || 3001;
        this.app = express();
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
            console.log(`Connected to the ${database} database.`)

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

    insert = (value) => {
        const sql = `INSERT INTO Department (name) VALUES ($1)`;
        const params = [value];
        warn('INSERTING')
        //const sql = `INSERT INTO movies (movie_name)
        // VALUES ($1)`;
        // const params = [body.movie_name];

        this.pool.query(sql, params, (err, result) => {
            if (err) {
                warn(err);
                return;
            }

        });
    }

    selectAndJoin = async (SELECTION, TABLE1, TABLE2, JOIN) => {
       
        const sql = `SELECT ${SELECTION} FROM ${TABLE1} INNER JOIN ${TABLE2} ON ${JOIN}`;
        
        this.pool.query(sql, (err, { rows }) => {
            console.table(rows);
        })
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
            console.log(rows);
            
            return rows;
            //_selectAllFromTable(this, sql);
        });/*
        return (await this.pool.query(sql, (err, { rows }) => {
            if (err) {
                error(err);
                return err
            }
            log(sql, 'magenta');
            log(rows, 'red');
            
            return rows;
            //_selectAllFromTable(this, sql);
        }))*/
        /*
        query = (action, select, table) => {
            this.pool.query(`${action} ${select} FROM ${table}`, function (err, { rows }) {
                console.log(rows);
            });
        }*/

    }
}

const _selectAllFromTable = async (server, sql) => {
    log(server, 'white');
    await server.pool.query(sql, (err, { rows }) => {
        if (err) {
            error(err);
            return err
        }
        log(sql, 'magenta');
        log(rows, 'red');
        let rowString = JSON.stringify(rows);
        return rows;
        //            log (rows, 'blue');
    });
}

let deletedRow = 2;
/*
pool.query(
  `DELETE FROM favorite_books WHERE id = $1`,
  [deletedRow],
  (err, { rows }) => {
    if (err) {
      console.log(err);
    }
    console.log(rows);
  }
);
*/
// Query database
/*
const query = () => {
    pool.query('SELECT * FROM Departments', function (err, { rows }) {
        console.log(rows);
    });
}

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
*/
module.exports = Server;
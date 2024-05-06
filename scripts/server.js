const express = require('express');
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
class Server {
    constructor(database) {
        this.PORT = process.env.PORT || 3001;
        this.app = express();

        // Express middleware
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use((req, res) => {
            res.status(404).end();
        });
        
        this.app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        this.pool;
        if(database) {
            this.connectToDB(database);
        }

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
            console.log(`Connected to the ${database} database.`)
        )

        this.pool.connect();
    }

    query = () => {
        this.pool.query('SELECT * FROM Departments', function (err, { rows }) {
            console.log(rows);
        });
    }

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

module.exports = Server;
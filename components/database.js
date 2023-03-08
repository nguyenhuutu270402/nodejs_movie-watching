require('dotenv').config();

const { Pool } = require('pg');

const connection = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

connection.connect(function (err, connection) {
    if (err) console.log(err)
    else console.log("Ket noi CSDL thanh cong");
});

module.exports = connection;
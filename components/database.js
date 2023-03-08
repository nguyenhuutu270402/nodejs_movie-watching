require('dotenv').config();

const { Pool } = require('pg');

const connection = new Pool({
    user: 'upqpbfs5dbfgpfodl4qj',
    host: 'bqcmqdzwlgoreh8cevsr-postgresql.services.clever-cloud.com',
    database: 'bqcmqdzwlgoreh8cevsr',
    password: '61q7mu09pkYobFBI1tjDmyKXxXXY3P',
    port: 5432,
});

connection.connect(function (err, connection) {
    if (err) console.log(err)
    else console.log("Ket noi CSDL thanh cong");
});

module.exports = connection;
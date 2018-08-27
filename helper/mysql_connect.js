var mysql = require('mysql');
var connect = mysql.createConnection({
    database : 'mypizza',
    user : 'root',
    password : '',
});

module.exports = connect;
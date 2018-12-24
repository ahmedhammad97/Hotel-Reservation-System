const mysqls = require('mysql');

const con = mysqls.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Hotel_System_DB"
});

module.exports = con;

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user:"root",
    password: "",
    database:"chattingapp"
});
con.connect(function(err){
    if(err){
        console.log("DB connection Failed");
        return;
    }
    console.log("DB Connected");
})

module.exports = con;
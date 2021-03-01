//Vipradeep 27 Feb 2021 - 
//Connect DB[sqlite],Express,Connect Twitter  
//Connect to the database 
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
//Create DB if not exists 
let db = new sqlite3.Database("./data/LP_Twit_Base_V2.db",sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
     if (err) {
        console.error(err.message);
    } else {
        console.log('Step2 : Connected to the New LP_Twit_Base_V2 database.|');
    }
    });
const sql_create = `CREATE TABLE IF NOT EXISTS Twit_API_V4(
  Twit_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Twit_ID_Orig INTEGER,
  Twit_Value TEXT,
  Twit_Comments VARCHAR(100) ,
 UNIQUE(Twit_ID_Orig , Twit_Value)
);`;

db.run(sql_create, err => {
  if (err) {
    return console.error(err.message);
  }
if (!err) {
  console.log("Step3 : Successful creation of the 'Twit_API_V4' table");
  }
  
});

const express = require("express");
// Creating the Express server
const app = express();
var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//Setting the port
const PORT = 8080; 
// Server configuration
app.use(express.static(path.join(__dirname, "./public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.engine('ejs', require('ejs').renderFile);
app.listen(PORT, () => {
//confirm the port in Console
    console.log(`Step1 : The server is started with EXPRESS Handlers now running on Port : ${PORT}`);
});
//retrieve data 
var Twitter = require('twitter');
var router = express.Router();
//Loading for the first time

app.get("/", (req, res) => {


const sql = "SELECT * FROM Twit_API_V4 ORDER BY Twit_ID_Orig"
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error("Error while fetching data from Twitter DB: "+err.message);
    }
    console.log(`Step4 : Data Rendering from DB Complete`);
    res.render("twdata", { model: rows });
  });
//Load data from Local DB first time
var client = new Twitter({
  consumer_key: 'YDn3RLk0s2UiYj2R71Qg',
  consumer_secret: 'zaFtCeJgX6fgM4wsYVWeYHtrBadPxUd3vaGfIIY7Y',
  access_token_key: '357401051-thSpfJV79tqludpTPUx7Ak2Lx2Llt7hQbbCc1rRL',
  access_token_secret: 'K0L6mvFv5fwewpGdQOQJVOEMD0I6eIJLp3LsFxqjC3qGS'
});
  client.get('search/tweets', { q: '#liveperson', count: 1000 }, function(error, tweets, response) {
    if (!error) {

res.status(200).render('data', { title: 'Twitter Response', tweets: tweets });
console.log(`-=-=-=-=-=There is no server error while trying to get data from Twitter-=-=-=-=-=-=`);
tweets.statuses.forEach(function (status) { 
//Open DB with table, check if ID exists, If not try inserting the new row in to the table
const sqlite3 = require('sqlite3').verbose();
// open the database
let sql = `SELECT  Twit_ID_Orig Id,Twit_Value name FROM Twit_API_V4 WHERE Twit_ID_Orig = ?`;
let UniquelistId = status.id_str;
let statusText =status.text;
// first row only
db.get(sql, [UniquelistId],(err, row) => {
 if (err) {return console.error("error selecting row in DB"+err.message); }
console.log(`No Twit ID found with the id ${UniquelistId} ; so we will insert it now`);
var statusTextReplaced = statusText.replace('…','');
statusTextReplaced = statusTextReplaced.replace(/[`:~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
statusTextReplaced = statusTextReplaced.substring(0, 100);
console.log("Current text for insertion :" + statusTextReplaced);
var sql = "INSERT or IGNORE INTO Twit_API_V4 (Twit_ID_Orig ,Twit_Value) VALUES (?,?)";
var params = [UniquelistId,statusTextReplaced];
db.all(sql, params, (err, rows) => {
    if (err) {
        console.log("Error when adding unique rows :  ", err.message);
    }
console.log("Successful Insert of Id :" + UniquelistId);
});
});
});
    }
    else {
      res.status(500).json({ error: error });
    console.log(`There is server error while trying to get data from Twitter`+ error);
    }


});

});

//Refresh Data from DB server
app.get("/data", (req, res) => {
  const sql = "SELECT * FROM Twit_API_V4 ORDER BY Twit_ID_Orig"
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error("Error while fetching data from Twitter DB: "+err.message);
    }
    res.render("twdata", { model: rows });
  });
});


/**
 * http_server.js -- JavaScript to build an Hypertext Transport Protocol (HTTP) Server.
 * --------------
 *
 */

var express = require("express"); // the code for our 'Server'
var app = express(); // starts 'ExpressJS' Application
var low = require("lowdb");
var fs = require("lowdb/adapters/FileSync");
var adapter = new fs("db.json");
var db = low(adapter);

// configure express to serve static files from public directory
// -------------------------------------------------------------
app.use(express.static("public"));

// init the data store
db.defaults({ posts: [] }).write();

/**
 * R O U T E S
 * -----------
 */

// ----------------------------------------------------
// L I S T - list posts
//      curl http://localhost:3000/data
// ----------------------------------------------------
app.get("/data", function (req, res)
{
    // returns all data in the database
    res.send(db.get("posts").value());
});

// ----------------------------------------------------
// A D D - add post - test using:
//    curl http://localhost:3000/posts/ping/1/false
// ----------------------------------------------------
app.get("/posts/:title/:id/:published", function (req, res)
{
    var post = {
        id: Number(req.params.id),
        title: req.params.title,
        published: req.params.published,
    };
    console.log(post);
    db.get("posts").push(post).write();
    console.log(db.get("posts").value());
    res.send(db.get("posts").value());
});

// ----------------------------------------------------
// S H O W   P U B L I S H E D - filter by published state - test using:
//                          curl http://localhost:3000/published/true
// ----------------------------------------------------
app.get("/published/:boolean", function (req, res)
{
    var post = {
        published: req.params.published,
    };

    // returns all data in the database that matches 'published' state
    res.send(db.get("posts").value());
});

// ----------------------------------------------------
// S E T   P U B L I S H E D - update published value - test using:
//                        curl http://localhost:3000/published/1/true
// ----------------------------------------------------
app.get("/published/:id/:boolean", function (req, res)
{
    // YOUR CODE
});

// ----------------------------------------------------
// D E L E T E - delete entry by id - test using:
//          curl http://localhost:3000/delete/5
//
// ----------------------------------------------------
app.get("/delete/:id/", function (req, res)
{
    // YOUR CODE
});

// start server
// -----------------------
app.listen(3000, function ()
{
    console.log("Running at port 3000");
});

/*
 * simple.js -- text module for using lowdb.
 * ---------
 *
 */

var low = require("lowdb");
var fs = require("lowdb/adapters/FileSync");
var adapter = new fs("db.json");
var db = low(adapter);

const MAX_ENTRIES = 999;

// Inlcude readline to ask user questions
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// init the data store
// -------------------
// Set some defaults
db.defaults({ posts: [] }).write();

// function to generate timestamp string: MM/DD/YYYY HH:MM:SS.mmm
var timeStamp = function (x) {
    let now = new Date();
    return (
        now.getMonth() +
        1 +
        "/" +
        now.getDate() +
        "/" +
        now.getFullYear() +
        " " +
        now.getHours() +
        ":" +
        now.getMinutes() +
        ":" +
        now.getSeconds() +
        "." +
        now.getMilliseconds()
    );
};
var published;

// Add some posts... a lot
for (let index = 0; index < MAX_ENTRIES; index++) {
    published = index % 2 == 0;
    db.get("posts")
        .push({
            id: index + 1,
            title: "lowdb is awesome #" + (index + 1),
            published: published,
            Timestamp: timeStamp(),
        })
        .write();
}

// count posts
// -----------
var entries = db.get("posts").size().value();

console.log(" ");
console.log("The DB has: " + entries.toString() + " Posts.");
console.log(" ");

// find all posts ids
// ------------------
var id, title;

for (let index = 0; index < entries; index++) {
    id = db.get("posts[" + index + "].id").value();
    title = db.get("posts[" + index + "].title").value();
    console.log("Entry ID: " + id + " = TITLE: " + title);
}

// all matches of published false
// ------------------------------
var pending = 0;
var published = false;

for (let index = 0; index < entries; index++) {
    published = db.get("posts[" + index + "].published").value();
    if (published == false) {
        pending++;
    }
}

console.log(" ");
console.log("The DB has: " + pending + " posts needing to be published.");

// find post with published false
// ------------------------------

var post = db.get("posts").find({ published: false }).value();

console.log(" ");
console.log("Entry ID: " + post.id + " = TITLE: " + post.title + ", needs to be published!");

// find post with a specific ID
// ----------------------------
var searchId = MAX_ENTRIES - 4;

console.log(" ");

// {TBD} -- I can't get to stop for keyboard input...
rl.question("What DB Entry do you want to see? ", function (searchId) {
    console.log(" ");
    console.log(`You asked for ID: ${searchId}...`);
});

var post = db.get("posts").find({ id: searchId }).value();

console.log(" ");
console.log("Entry ID: " + post.id + " = TITLE: " + post.title + ", found!");

console.log(" ");
console.log("...closing.");

// Drop Console UI
rl.close();

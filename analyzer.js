const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./messages.db");

/* CREATE TABLES IF NOT EXISTS */

db.run(`
CREATE TABLE IF NOT EXISTS issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issue TEXT,
  reported_by TEXT,
  reported_at TEXT,
  resolved_by TEXT,
  resolved_at TEXT,
  resolution_time TEXT,
  status TEXT
)
`);

db.run(`
ALTER TABLE messages ADD COLUMN analyzed INTEGER DEFAULT 0
`, () => {});

/* MAIN ANALYZER FUNCTION */

function analyzeMessages() {

db.all(
"SELECT id,sender,message,date FROM messages WHERE analyzed=0 ORDER BY date ASC",
(err, rows) => {

if (err) {
console.log(err);
return;
}

let currentIssue = null;

for (const msg of rows) {

const text = msg.message.toLowerCase();

/* ISSUE KEYWORDS */

const issueKeywords = [
"error",
"not working",
"not coming",
"not syncing",
"stuck",
"delay"
];

/* RESOLUTION KEYWORDS */

const resolveKeywords = [
"fixed",
"resolved",
"done",
"working now",
"check now"
];

const isIssue = issueKeywords.some(word => text.includes(word));
const isResolved = resolveKeywords.some(word => text.includes(word));

/* NEW ISSUE DETECTED */

if (isIssue) {

currentIssue = {
issue: msg.message,
reported_by: msg.sender,
reported_at: msg.date
};

db.run(
`INSERT INTO issues(issue,reported_by,reported_at,status)
VALUES(?,?,?,?)`,
[
currentIssue.issue,
currentIssue.reported_by,
currentIssue.reported_at,
"pending"
]
);

}

/* ISSUE RESOLVED */

if (isResolved && currentIssue) {

const start = new Date(currentIssue.reported_at);
const end = new Date(msg.date);
const minutes = Math.round((end - start) / 60000);

db.run(
`UPDATE issues
SET resolved_by=?, resolved_at=?, resolution_time=?, status='resolved'
WHERE issue=? AND reported_at=?`,
[
msg.sender,
msg.date,
minutes + " min",
currentIssue.issue,
currentIssue.reported_at
]
);

currentIssue = null;

}

/* MARK MESSAGE ANALYZED */

db.run(
"UPDATE messages SET analyzed=1 WHERE id=?",
[msg.id]
);

}

console.log("Analysis completed");

});

}

module.exports = analyzeMessages;

/* RUN DIRECTLY */

if (require.main === module) {
analyzeMessages();
}

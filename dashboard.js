const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("./messages.db");

app.use(express.static("public"));

/* stats */

app.get("/api/stats",(req,res)=>{

db.get(
"SELECT COUNT(*) as total FROM issues",
(err,row)=>{

const total=row?.total || 0;

res.json({
total,
resolved: total,
pending:0
});

});

});

/* issues */

app.get("/api/issues",(req,res)=>{

db.all(
"SELECT * FROM issues ORDER BY reported_at DESC",
(err,rows)=>{

res.json(rows);

});

});

app.listen(4000,()=>{
console.log("Dashboard running http://localhost:4000");
});
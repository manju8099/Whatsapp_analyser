const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./messages.db');

db.run(`
CREATE TABLE IF NOT EXISTS messages(
id INTEGER PRIMARY KEY AUTOINCREMENT,
sender TEXT,
message TEXT,
date TEXT
)
`);

const client = new Client({
authStrategy: new LocalAuth()
});

client.on('qr', qr => {
qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
console.log('WhatsApp Bot Ready!');
});

client.on("message", async msg => {

const contact = await msg.getContact();

const senderName = contact.pushname || contact.name || msg.from;

db.run(
"INSERT INTO messages(sender,message,date) VALUES(?,?,?)",
[
senderName,
msg.body,
new Date().toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})
]);

console.log("Saved:", senderName, msg.body);

});

client.initialize();
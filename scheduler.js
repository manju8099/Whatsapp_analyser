const cron = require("node-cron");
const analyzeMessages = require("./analyzer");
const sendMail = require("./sendMail");

cron.schedule("0 20 * * *", async () => {

console.log("Running AI Analysis...");

const summary = await analyzeMessages();

await sendMail(summary);

});
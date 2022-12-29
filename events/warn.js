const client = require("../index");

client.on("warn", (warn) => {
    console.log(String(warn))
});
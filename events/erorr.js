const client = require("../index");

client.on("error", (erorr) => {
    console.log(String(erorr))
})

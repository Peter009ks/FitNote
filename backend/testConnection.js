require("dotenv").config();
const mongoose = require("mongoose");

console.log("Node:", process.version);

const uri = process.env.MONGO_URI;
console.log(uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:******@"));

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
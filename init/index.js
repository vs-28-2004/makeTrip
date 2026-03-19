const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
    await initDB();
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } 
}
            

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((item) => ({ ...item, owner: "69b2b6ab103a902266a259ff" }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();

main();

import { MongoClient, ObjectId } from "mongodb";
import { exit } from "process";

const url = process.env.DATABASE_URL;
const client = new MongoClient(url);

try {
    await client.connect();
    console.log("Mongo Client connected succesfully");
} catch (err) {
    console.error(err);
    exit(1);
}

const database = client.db();
const users = database.collection("users");
const tweets = database.collection("tweets");


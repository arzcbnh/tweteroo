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

export async function signup(user) {
    const hasExistingUser = (await users.findOne({ username: user.username })) != null;

    if (!hasExistingUser) {
        users.insertOne(user);
    }
}

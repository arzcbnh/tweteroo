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

export async function postTweet(tweet) {
    tweets.insertOne(tweet);
}

export async function getTweets() {
    const bareTweets = await tweets.find().toArray();
    const richTweets = bareTweets.map(async (tweet) => {
        const user = await users.findOne({ username: tweet.username });
        return { ...tweet, avatar: user.avatar };
    });

    return Promise.all(richTweets);
}

export async function editTweet(id, tweet) {
    const isSuccessful = true;
    const foundTweet = await tweets.findOne({ _id: new ObjectId(id) });

    if (foundTweet == null) {
        return !isSuccessful;
    }

    tweets.updateOne({
        _id: new ObjectId(id)
    }, {
        $set: tweet
    })

    return isSuccessful;
}

export async function deleteTweet(id) {
    const isSuccessful = true;
    const foundTweet = await tweets.findOne({ _id: new ObjectId(id) });

    if (foundTweet == null) {
        return !isSuccessful;
    }

    tweets.deleteOne({ _id: new ObjectId(id) })

    return isSuccessful;
}

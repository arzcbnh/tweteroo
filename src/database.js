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

export async function registerUser(user) {
    const existingUser = await users.findOne({ username: user.username });

    if (existingUser == null) {
        return users.insertOne(user);
    } else {
        return users.updateOne({
            _id: existingUser._id
        }, {
            $set: user
        });
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

export async function editTweet(id, newTweet) {
    const oldTweet = await tweets.findOne({ _id: new ObjectId(id) });

    if (oldTweet == null) {
        throw new Error("Not found");
    }

    return tweets.updateOne({
        _id: oldTweet._id
    }, {
        $set: newTweet
    });
}

export async function deleteTweet(id) {
    const tweet = await tweets.findOne({ _id: new ObjectId(id) });

    if (tweet == null) {
        throw new Error("Not found");
    }

    return tweets.deleteOne({ _id: tweet._id });
}

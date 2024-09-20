import express, { json } from "express";
import cors from "cors";

import * as database from "./database.js";
import * as schemas from "./schemas.js";

const port = process.env.PORT;
const app = express();
app.use(json());
app.use(cors());

app.post("/sign-up", async (req, res) => {
    const user = req.body;

    try {
        schemas.validateUser(user);
        await database.signup(user);
        res.sendStatus(201);
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = err.details.map(detail => detail.message);
            return res.status(422).send(messages);
        } else {
            console.error(err);
            res.sendStatus(500);
        }
    }
});

app.post("/tweets", async (req, res) => {
    const tweet = req.body;

    try {
        schemas.validateTweet(tweet);
        await database.postTweet(tweet);
        res.sendStatus(201);
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = err.details.map(detail => detail.message);
            return res.status(422).send(messages);
        } else {
            console.error(err);
            res.sendStatus(500);
        }
    }
})

app.get("/tweets", async (req, res) => {
    try {
        const tweets = await database.getTweets();
        res.send(tweets);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.put("/tweets/:id", async (req, res) => {
    const { id } = req.params;
    const tweet = req.body;

    try {
        schemas.validateTweet(tweet);
        const isSuccessful = await database.editTweet(id, tweet);

        if (!isSuccessful) {
            return res.sendStatus(404);
        }

        res.sendStatus(204);
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = err.details.map(detail => detail.message);
            return res.status(422).send(messages);
        } else {
            console.error(err);
            res.sendStatus(500);
        }
    }
})

app.delete("/tweets/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await database.deleteTweet(id);
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})

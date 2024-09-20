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
    const validation = schemas.user.validate(user);

    if (validation.error) {
        const messages = validation.error.details.map(detail => detail.message);
        return res.status(422).send(messages);
    }

    try {
        await database.signup(user);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})

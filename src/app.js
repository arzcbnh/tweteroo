import express, { json } from "express";
import cors from "cors";

const port = process.env.PORT;
const app = express();
app.use(json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Running");
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})

import express from "express";
import morgan from "morgan";
import projectsRouter from "./routes/projects.js";

const app = express();
const port = process.env.PORT || process.env.NODE_PORT || 3001;

app.use(morgan("tiny"));
app.use(projectsRouter);

app.get("/", (req, res) => {
    return res.json({ message: "You Reached The Looking For Group API" });
})

app.listen(port, (err) => {
    if (err) { throw err; }
    console.log(`Listening on port ${port}`);
});

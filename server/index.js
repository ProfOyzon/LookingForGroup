import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import usersRouter from "./routes/users.js";
import projectsRouter from "./routes/projects.js";


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || process.env.NODE_PORT || 3001;

app.use(express.static(join(__dirname, "../client/build")));
app.use(morgan("tiny"));
app.use(express.json());
app.use(usersRouter);
app.use(projectsRouter);

app.get("/api", (req, res) => {
    return res.json({ message: "You Reached The Looking For Group API" });
})

app.get("/*", (req, res) => {
    res.sendFile("index.html", {root: join(__dirname, '../client/build/')});
})

app.listen(port, (err) => {
    if (err) { throw err; }
    console.log(`Listening on port ${port}`);
});

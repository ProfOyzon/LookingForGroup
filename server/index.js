import express from "express";
import session from "express-session";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import usersRouter from "./routes/users.js";
import projectsRouter from "./routes/projects.js";
import datasetsRouter from "./routes/datasets.js";
import envConfig from "./config/env.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = envConfig.port;

// Serve frontend files and images
app.use(express.static(join(__dirname, "../client/build")));
app.use("/images", express.static(join(__dirname, "./images")));

app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(usersRouter);
app.use(projectsRouter);
app.use(datasetsRouter);

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

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

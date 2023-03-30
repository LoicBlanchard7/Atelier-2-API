const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const eventRouter = require("./routes/event");
const participantsRouter = require("./routes/participants");

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/participants", participantsRouter);
app.use("/event", eventRouter);

app.use("*", (req, res) => {
  res
    .status(404)
    .json({ type: "error", error: 404, message: "page introuvable" });
});

module.exports = app;

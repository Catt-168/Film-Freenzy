const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const moviesRouter = require("./routers/movies");
const usersRouter = require("./routers/users");
const rentalRouter = require("./routers/rentals");
const genreRouter = require("./routers/genres");
const authRouter = require("./routers/authRouter");
const languageRouter = require("./routers/languages");
const actorRouter = require("./routers/actors");
const dashboardRouter = require("./routers/dashboard");
const forgotPasswordRouter = require("./routers/forgotPassword");

require("./db");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/movies", moviesRouter);
app.use("/users", usersRouter);
app.use("/rentals", rentalRouter);
app.use("/genres", genreRouter);
app.use("/languages", languageRouter);
app.use("/actors", actorRouter);
app.use("/dashboard", dashboardRouter);
app.use("/forgotPassword", forgotPasswordRouter);
app.use("/", authRouter);

const start = async () => {
  try {
    app.listen(3000, () => console.log(`Server started on port 3000`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();

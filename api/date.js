const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const { URI } = process.env;
const User = require("./user");

//middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: "https://svelte-new-vercel-jhmp0wyvl.vercel.app/", // <-- location of the app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode", // <-- here we are defining the cookie name to be stored in the users browser
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport); // defining passport and passing in the passport library

//db
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", () => {
  console.log("Mongoose Database is Connected");
});

app.post("/login", (req, res, next) => {
  //check to see if user exists
  console.log("logging in ...");
  passport.authenticate("local", (err, user, info) => {
    console.log(user);
    if (err) throw err;
    if (!user) res.json({ message: "User does not exist" });
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.json({ message: "User exists" });
      });
    }
  })(req, res, next);
});
app.post("/create", async (req, res) => {
  //check to see if user exists
  console.log("creating ...");
  const { username, password } = req.body;

  try {
    const data = await User.findOne({ username });
    if (!data) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        password: hashedPassword,
      });
      await newUser.save();
      res.json({ message: "Client created" });
    } else {
      res.json({ message: "Client already exists" });
    }
  } catch (err) {
    res.json({ message: err });
  }
});
app.get("/user", (req, res) => {
  console.log("getting user...");
  res.json({ message: req.user }); // The req.user stores the entire user that has been authenticated inside of it.
});
app.get("/logout", (req, res, next) => {
  console.log("logging out ...");
  req.logOut();
  res.json({ message: "User logged out" });
});
app.listen(5001, () => {
  console.log("App's running on port 5001");
});

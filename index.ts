const express = require("express")
const userRoutes = require("./routes/user-routes")
const postRoutes = require("./routes/post-routes")
const mongoose = require("mongoose")
const bodyParser = require("express")
const profileRoutes = require("./routes/profile-routes")
const commentRoutes = require("./routes/comment-routes")
const app = express();

//----------form settings------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

//----------routes------------
app.use("/user", userRoutes);
app.use("/profile", profileRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

//----------start------------
app.listen(process.env.PORT || 5001, async () => {
  await mongoose.connect("mongodb+srv://artem:03mern09@cluster0.jgac3fv.mongodb.net/?retryWrites=true&w=majority");
  console.log("Server has been started on port 5001");
});

export = {}

/*
"mongodb+srv://artem:03mern09@cluster0.jgac3fv.mongodb.net/?retryWrites=true&w=majority"*/

/*
"mongodb://artem:03mern09@mongo:27017/"
*/

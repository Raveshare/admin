const express = require("express");
const cors = require("cors");
const fileToS3 = require("./scripts/fileToS3");
const getAssetJSON = require("./scripts/getAssetJSON");
const deleteCache = require("./scripts/deleteCache");
const deleteCacheByPattern = require("./scripts/deleteCacheByPattern");
const checkWhitelist = require("./scripts/checkWhitelist");
const uploadToDb = require("./scripts/uploadToDb");
const auth = require("./middleware/auth");
const showCollections = require("./collections/showCollections");
const showTemplates = require("./templates/showTemplates");
const showUsers = require("./users/showUsers");
const addTask = require("./tasks/addTask");
const getTask = require("./tasks/getTask");
const getAllPointsHistory = require("./rewards/getAllPointsHistory");
const editUser = require("./users/editUser");

const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/fileToS3", auth, fileToS3);
app.use("/getAssetJSON", auth, getAssetJSON);
app.use("/deleteCache", auth, deleteCache);
app.use("/deleteCacheByPattern", auth, deleteCacheByPattern);
app.use("/checkWhitelist", checkWhitelist);
app.use("/uploadToDb", auth, uploadToDb);
app.use("/collections", auth, showCollections);
app.use("/templates", auth, showTemplates);
app.use("/users", auth, showUsers);
app.use("/getTask", auth, getTask);
app.use("/addTask", auth, addTask);
app.use("/getAllPointsHistory", auth, getAllPointsHistory);
app.use("/editUser", auth, editUser);

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});


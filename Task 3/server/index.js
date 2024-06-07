const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/db");
const app = express();
const port = 3000;

app.use(bodyParser.json());


//use user routes
app.use("/", require("./routes/routes"));



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

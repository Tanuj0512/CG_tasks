const express = require('express');
const dotenv = require('dotenv');
// require("./schedule1");
// require("./schedule2");

dotenv.config(); // Ensure dotenv is configured

const port = 2000;
const app = express();
app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

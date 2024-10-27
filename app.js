require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const connection = require("./database/db.config");

const usersRoutes = require("./routes/users.routes");
const questionsRoutes = require("./routes/question.routes");
const answerRoutes = require("./routes/answers.routes");
const auth = require("./middleware/auth.middleware");

app.use("/api/users", usersRoutes);
app.use("/api/questions", auth, questionsRoutes);
app.use("/api/answers", auth, answerRoutes);

(async () => {
  try {
    const result = await connection.execute("SELECT 'test'");
    //  console.log(result); // Print the result of the test query

    await app.listen(port);
    console.log("Database connection established :(");
    console.log(`Listening on ${port}: http://localhost:${port}`);
  } catch (err) {
    console.error(err.message);
  }
})();

// trial

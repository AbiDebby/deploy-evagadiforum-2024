// Import necessary modules
const { StatusCodes } = require('http-status-codes');
const connection = require('../database/db.config');
const uuidv4 = require('uuid').v4;

/********************* Create a new question  *************************************/
const postQuestion = async (req, res) => {
  const { question, description, tag } = req.body;
  const { user_id, username } = req.user;

  // Validate request body
  if (!question || !description || !tag) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      err: 'Bad Request',
      msg: 'Please provide all required fields',
    });
  }

  try {
    const question_id = uuidv4(); // Generate a UUID
    // Insert the question into the database
    const query = `INSERT INTO questions (question_id,user_id, username, question, description, tag) VALUES (?,?,?,?,?,?)`;
    await connection.query(query, [
      question_id,
      user_id,
      username,
      question,
      description,
      tag,
    ]);

    // Return success response
    res.status(StatusCodes.CREATED).json({
      msg: 'Question created successfully',
    });
  } catch (err) {
    console.error(err.message);

    // Return internal server error response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      err: 'Internal Server Error',
      msg: 'An unexpected error occurred.',
    });
  }
};

/******************************** get single question *************************************/

// Get All Question
const allQuestions = async (req, res) => {
  try {
    // Query to get all questions with their user details
    const [questions] = await connection.query(`
      SELECT q.question_id, q.question, q.description AS content, u.username AS username 
      FROM questions q
      JOIN users u ON q.user_id = u.user_id
    `);

    // Handle case where no questions are found
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        err: 'Not Found',
        msg: 'No questions found.',
      });
    }

    // Send the list of questions as the response
    res.status(StatusCodes.OK).json({ questions });
  } catch (err) {
    console.error(err); // Log the entire error for more context

    // Handle server error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      err: err.message,
      msg: 'An unexpected error occurred.',
    });
  }
};

//Get Single Question
const getSingleQuestion = async (req, res) => {
  const { question_id } = req.params;

  try {
    // Check if question exists
    const [question] = await connection.query(
      `SELECT username, question, description, tag, question_id FROM questions q WHERE question_id = ?`,
      [question_id]
    );

    // If question does not exist
    if (question.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Not Found',
        message: `Question with ID ${question_id} not found`,
      });
    }

    // Get current timestamp when the question is retrieved
    //  const created_at = new Date().toISOString(); // Generates the current timestamp

    // Return the question details with dynamically generated 'created_at'
    res.status(StatusCodes.OK).json({
      question,
    });
  } catch (error) {
    // Handle any other errors (like DB connection issues)
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred.',
    });
  }
};

module.exports = { postQuestion, getSingleQuestion, allQuestions };

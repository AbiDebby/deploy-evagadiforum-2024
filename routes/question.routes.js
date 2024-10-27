const express = require('express');
const router = express.Router();
// const allQuestions = require('../controller/question.controller');
// router.get('/all-questions', allQuestions);

const auth = require('../middleware/auth.middleware');
//post question code starts here
const {
  postQuestion,
  allQuestions,
  getSingleQuestion,
} = require('../controller/question.controller');

// Post question route
router.post('/', postQuestion);

//get single question route

// Get Single Question
router.get('/:question_id', getSingleQuestion);

router.get('/', allQuestions);

module.exports = router;

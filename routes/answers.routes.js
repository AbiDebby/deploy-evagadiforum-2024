const express = require('express');
const router = express.Router();

//import all the answer controllers
const {
  postAnswer,
  answerForQuestion,
} = require('../controller/answer.controller');

//answer route
router.post('/', postAnswer);

router.get('/:question_id', answerForQuestion);

//export the route
module.exports = router;

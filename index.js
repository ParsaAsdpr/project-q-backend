const express = require('express');
const users = require('./Routes/users');
const questions = require('./Routes/questions');
const answers = require('./Routes/answers');
const comments = require('./Routes/comments');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/project-q').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

app.use(express.json());
app.use('/api/users', users);
app.use('/api/questions', questions);
app.use('/api/answers', answers);
app.use('/api/comments', comments);

app.listen(port, () => {
    console.log('Server is running on port ' + port);
})
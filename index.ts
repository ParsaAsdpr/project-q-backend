const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const users = require('./Routes/users/users');
const questions = require('./Routes/questions');
const answers = require('./Routes/answers');
const comments = require('./Routes/comments');
const login = require('./Routes/login');
const upload = require('./Routes/upload')
const follow = require('./Routes/users/follow');

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/project-q').then(() => {
    console.log('Connected to MongoDB');
}).catch((err: any) => {
    console.log(err);
});

const corsOptions = {
    exposedHeaders: 'Authorization',
  };

app.use("/static", express.static('static'));
app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/users', users);
app.use('/api/questions', questions);
app.use('/api/answers', answers);
app.use('/api/comments', comments);
app.use('/api/login', login);
app.use('/api/upload', upload);
app.use('/api/follow', follow);

app.listen(port, () => {
    console.log('Server is running on port ' + port);
})
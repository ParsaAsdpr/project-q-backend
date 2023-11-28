const express = require('express');
const validate = require('../utils/Middleware/validations/validateComment');
const { Comment } = require('../Models/commentsModel');
const { default: mongoose } = require('mongoose');
const auth = require('../utils/Middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    const comments = await Comment.find();
    if (!comments) return res.status(404).send('نظری پیدا نشد');
    if (comments.length < 1) return res.status(404).send('نظری پیدا نشد');
    res.send(comments);
})
router.post('/', auth, async (req, res) => {
    const validatedComment = validate(req.body);
    if (validatedComment.error) return res.status(400).send(validatedComment.error.details[0].message);

    try{
        if (!mongoose.Types.ObjectId.isValid(req.body.user_id)) return res.status(400).send("Invalid User ID");
        if (!mongoose.Types.ObjectId.isValid(req.body.answer_id)) return res.status(400).send("Invalid Answer ID");

        const comment = new Comment({
            user_id: req.body.user_id,
            answer_id: req.body.answer_id,
            body: req.body.body,
            timestamp: req.body.timestamp
        })

        await comment.save();
        res.status(201).send({
            message: "Comment created successfully",
            comment: {
                user_id: comment.user_id,
                answer_id: comment.answer_id,
                body: comment.body,
                timestamp: comment.timestamp
            }
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router
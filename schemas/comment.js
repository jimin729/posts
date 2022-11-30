const mongoose = require("mongoose");

//서버가 가져갈 데이터들의 값들 형식
const commentSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        postId: {
            type: String,
            required: true,
        },
    },
    //시간을 표시해주는 메서드
    { timestamps: true }
);

//
const comment = mongoose.model("comments", commentSchema);

//통과되는 문
module.exports = comment;

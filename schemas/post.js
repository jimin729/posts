const mongoose = require("mongoose");

//      서버가 가져갈 데이터들의 값들 형식
const postSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    //시간을 표시해주는 메서드
    { timestamps: true }
);

//
const Post = mongoose.model("post", postSchema);

//이게 있어야 하는 이유는?
module.exports = Post;

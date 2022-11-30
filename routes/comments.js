// /routes/comments.js
const express = require("express");
const router = express.Router();
//받아올 값들이 주소
const comment = require("../schemas/comment.js");
const Post = require("../schemas/post.js");
//입력값       //request(요청객체), response(응답객체)
router.post("/comments/:_postId", async (req, res) => {
    //try는 잘되었을때와 오류가 났을때catch를 사용하기위해 잡는것
    try {
        //만들기       //썬더 클라이언트에 받아질 것들 타이틀은 요청 객체 바디 안에 타이틀

        const { _postId } = req.params;
        const posting = await Post.findOne({ _id: _postId });
        const { content } = req.body;

        if (posting === null) {
            return res
                .status(400)
                .json({ message: "게시글을 찾을 수 없습니다." });
        }
        if (content.length === 0) {
            return res.status(400).json({ message: "댓글을 입력하세요." });
        }
        console.log(content.length);
        await comment.create({
            user: req.body.user,
            password: req.body.password,
            content: req.body.content,
            postId: req.params._postId,
        });

        //잘창조되면 201 .
        return res.status(201).json({ message: "댓글을 생성하였습니다." });
    } catch (error) {
        console.log(error);
        //오류가 났을때 400으로 상태를 표시하고  json으로 메시지 를 보낸다.
        return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});
//보여주는것
router.get("/comments/:_postId", async (req, res) => {
    try {
        //찾는 것을 포스팅이라고 설정함 //내가 보여주고 싶은 것을 찾는것
        const commenting = await comment.find();
        //콘솔 로그 찍어보는것 중요
        console.log(commenting);
        // 찾는 값은 comments에 있다.
        const results = commenting.map((comments) => {
            return {
                //콘솔에 나와 있는 값들 그리고 3T에 있는 실제 표기 값을 적어준다.
                commentId: comments._id,
                user: comments.user,
                content: comments.content,
                //끝에는 ,표시 안해준다.해줘도 되지만 오류가 날수도 있음
                createdAt: comments.createdAt,
            };
        });
        res.json({
            //보여지는[data]는 글자
            data: results,
        });
    } catch (error) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});

router.put("/comments/:_commentId", async (req, res) => {
    try {
        //언더바 _commentId를 const를 해주고
        const { _commentId } = req.params;

        const { password, content } = req.body;
        //한의 값을 찾을 꺼기 때문에 findOne으로 그리고 키 와 벨류 형 ({ 키 : 벨류 }) 를 사용
        const commenting = await comment.findOne({ _id: _commentId });

        if (commenting.password !== password) {
            return res.status(403).json({ message: "비밀번호가 다릅니다." });
        }
        if (commenting === null) {
            return res
                .status(404)
                .json({ message: "message: '댓글 조회에 실패하였습니다." });
        }
        if (content.length === 0) {
            return res
                .status(400)
                .json({ message: "댓글 내용을 입력해주세요." });
        }

        await comment.updateOne({ _id: _commentId }, { $set: { content } });
        return res.status(200).json({ message: "게시글을 수정하였습니다." });
    } catch (e) {
        return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});

router.delete("/comments/:_commentId", async (req, res) => {
    try {
        const { _commentId } = req.params;
        //우리가 가져올값들
        const { password } = req.body;
        const commenting = await comment.findOne({ _id: _commentId });
        if (commenting === null) {
            console.log(commenting);
            return res
                .status(404)
                .json({ message: "댓글 조회에 실패하였습니다." });
        }
        if (commenting.password !== password) {
            return res.status(403).json({ message: "비밀번호가 다릅니다." });
        }
        await comment.deleteOne({ password: password });
        return res.status(200).json({ message: "댓글을 삭제하였습니다." });
    } catch (e) {
        return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});

//이게 있어야 받아 올 수 있음
module.exports = router;

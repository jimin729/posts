// /routes/posts.js
const express = require("express");
const router = express.Router();
//받아올 값들이 주소
const Post = require("../schemas/post.js");
//입력값       //request(요청객체), response(응답객체)

router.post("/posts", async (req, res) => {
    //try는 잘되었을때와 오류가 났을때catch를 사용하기위해 잡는것
    try {
        //만들기       //썬더 클라이언트에 받아질 것들 타이틀은 요청 객체 바디 안에 타이틀
        await Post.create({
            title: req.body.title,
            user: req.body.user,
            password: req.body.password,
            content: req.body.content,
        });
        //잘창조되면 201 .
        res.status(201).json({ message: "게시글을 생성하였습니다." });
    } catch (error) {
        //오류가 났을때 400으로 상태를 표시하고  json으로 메시지 를 보낸다.
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});
//보여주는것
router.get("/posts", async (req, res) => {
    try {
        //찾는 것을 포스팅이라고 설정함 //내가 보여주고 싶은 것을 찾는것
        const posting = await Post.find();
        //콘솔 로그 찍어보는것 중요
        console.log(posting);
        // 찾는 값은 posts에 있다.
        const results = posting.map((posts) => {
            return {
                //콘솔에 나와 있는 값들 그리고 3T에 있는 실제 표기 값을 적어준다.
                postId: posts._id,
                user: posts.user,
                title: posts.title,
                //끝에는 ,표시 안해준다.해줘도 되지만 오류가 날수도 있음
                createdAt: posts.createdAt,
            };
        });
        //콘솔 찍는 습관
        console.log(results);

        res.json({
            //보여지는[data]는 글자
            data: results,
        });
    } catch (error) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});

//원하는 아이디값으로 상세 조희 하는 get 방식 async function 선언은 AsyncFunction객체를 반환하는 하나의 비동기 함수를 정의합니다.
router.get("/posts/:_postId", async (req, res) => {
    try {
        //언더바 _postId를 const를 해주고
        const { _postId } = req.params;
        //한의 값을 찾을 꺼기 때문에 findOne으로 그리고 키 와 벨류 형 ({ 키 : 벨류 }) 를 사용
        const posting = await Post.findOne({ _id: _postId });

        console.log(posting);
        return res.json({
            postId: posting._id,
            user: posting.user,
            title: posting.title,
            //끝에는 ,표시 안해준다.해줘도 되지만 오류가 날수도 있음
            createdAt: posting.createdAt,
        });
    } catch (error) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});

router.put("/posts/:_postId", async (req, res) => {
    try {
        //언더바 _postId를 const를 해주고
        const { _postId } = req.params;

        const { password, title, content } = req.body;
        //한의 값을 찾을 꺼기 때문에 findOne으로 그리고 키 와 벨류 형 ({ 키 : 벨류 }) 를 사용
        const posting = await Post.findOne({ _id: _postId });
        if (posting === null) {
            return res
                .status(404)
                .json({ message: "게시글 조회에 실패하였습니다." });
        }
        await Post.updateOne(
            { _id: _postId },
            { $set: { password, title, content } }
        );
        return res.status(200).json({ message: "게시글을 수정하였습니다." });
    } catch (e) {
        return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});

router.delete("/posts/:_postId", async (req, res) => {
    try {
        const { _postId } = req.params;
        //우리가 가져올값들
        const { password } = req.body;
        const posting = await Post.findOne({ _id: _postId });
        if (posting === null) {
            return res
                .status(404)
                .json({ message: "댓글 조희에 실패하였습니다." });
        }
        if (posting.password !== password) {
            return res.status(403).json({ message: "비밀번호가 다릅니다." });
        }
        await Post.deleteOne({ password: password });
        return res.status(200).json({ message: "댓글을 삭제하였습니다." });
    } catch (e) {
        return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});

//이게 있어야 받아 올 수 있음
module.exports = router;

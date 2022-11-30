const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
//http://localhost:3000/ 페이지
app.get("/", (req, res) => {
    res.send("Hello World!");
});
//api쪽 연결된 것
app.use("/", require("./routes/posts"));

app.use("/", require("./routes/comments"));

//콘솔로그에 찍힌것
app.listen(port, () => {
    console.log(port, "포트로 서버가 열렸어요!");
});

const connect = require("./schemas");
connect();

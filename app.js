const express = require ("express");
const postRouter= require("./routers/post");
const authRouter= require("./routers/auth");
const app = express();

require("dotenv").config();
const {PORT} = process.env;
const port = PORT||3000;

app.use(express.json());

app.use('/auth', authRouter);

app.use('/posts', postRouter);

app.listen(port, ()=>{
    console.log(`server attivo su http://localhost:${port}`);
})
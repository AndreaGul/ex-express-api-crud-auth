const express = require ("express");
const postRouter= require("./routers/post");
const authRouter= require("./routers/auth");
const categoriesRouter= require("./routers/categories")
const tagsRouter=require("./routers/tags")
const app = express();
const cors = require("cors");

require("dotenv").config();
const {PORT} = process.env;
const port = PORT||3000;

app.use(cors());

app.use(express.json());

app.use('/auth', authRouter);

app.use('/posts', postRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);

app.listen(port, ()=>{
    console.log(`server attivo su http://localhost:${port}`);
})
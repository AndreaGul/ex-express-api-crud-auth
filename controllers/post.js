const { PrismaClient } = require("@prisma/client");
const  generateSlug = require("../utils/generateSlug");
const prisma = new PrismaClient();
const deletePic = require("../utils/deletePic");
require("dotenv").config();
const{PORT,HOST}=process.env;
const port = PORT || 3000;

const store = async (req, res) => {
  const { title, content, categoryId, tags } = req.body;

  try {
    // Ottieni tutti i post per generare uno slug unico
    const posts = await prisma.post.findMany();
    const slug = generateSlug(title, posts);

    const data = {
      title,
      content,
      slug,
      published: req.body.published ? true : false,
      tags: {
        connect: tags.map(id => ({ id: parseInt(id) }))
      }
    };

    if (categoryId) {
      data.categoryId = parseInt(categoryId);
    }

    if (req.file) {
      data.img_path = `${HOST}:${port}/post_pics/${req.file.filename}`;
    }

    try {
      // Creare un post
      const post = await prisma.post.create({ data });
      res.status(200).send(post);
    } catch (err) {
      if (req.file) {
        deletePic('post_pics', req.file.filename);
      }
      errorHandler(err, req, res);
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Errore del server');
  }
};

const show = async (req, res) => {
    try {
        const {slug} = req.params;
        const post = await prisma.post.findUnique({
            where:{slug: slug},
            include: {
                category: {
                select: {
                name: true
                }
            },
            tags: {
                select: {
                name: true
                }
            }
            }
        });
        if(post){
            res.json(post);
        }else{
          res.status( 404).send(`post con slug ${slug} non trovata.`);
        }
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Errore del server');
    }
  };

const index = async (req, res) => {
  try {
    const {published,keyword}= req.query;
   const where ={};
    if(published === 'true'){
        where.published = true
    }else if(published === 'false'){
        where.published = false
    }

    if (keyword) {
        where.OR = [
          { title: { contains: keyword } }, // Cerca la keyword nel titolo
          { content: { contains: keyword } }, // Cerca la keyword nel contenuto
        ];
      }
    const posts = await prisma.post.findMany({
        where,
        orderBy:[
          {
            createAt: 'desc'
          }
        ],
        include: {
            category: {
            select: {
                name: true
            }
            },
            tags: {
            select: {
                name: true
            }
            }
        }
    });
    if(posts.length === 0){
        res.json(`Nessun post trovato`);
    }else{
        res.json({
            posts
          });
    }
   
  } catch (err) {
    console.error(err);
    res.status(500).send('Errore del server');
  }
};

const update = async (req, res) => {
    try{
        const { slug } = req.params;
        
       const postRicevuto= req.body;

       if(postRicevuto.title){
        const posts = await prisma.post.findMany();
        const newSlug = generateSlug(postRicevuto.title, posts);
        postRicevuto.slug=newSlug;
       }
        
        
        
        const post = await prisma.post.update({
          where: { slug },
          data: postRicevuto,
        });
        res.json(post);
    }catch(err){
        console.error(err);
        res.status(500).send('Errore del server');
    }
  }

  const destroy = async (req, res) => {
    try
    {
    const { slug } = req.params;
    await prisma.post.delete({
      where: { slug },
    });
    res.json(`Post con slug ${slug} eliminato con successo`);
    }
    catch(err){
      console.error(err);
      res.status(500).send('Errore del server');
  }
  }

module.exports = {
  store,
  show,
  index,
  update,
  destroy
};
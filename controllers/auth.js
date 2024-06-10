const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { hashPassword, comparePassword} = require("../utils/password");
const generateToken = require("../utils/generateToken")

const registration = async (req,res)=>{

    try{
        const { email,name,password} = req.body;

        const data = {
            email,
            name,
            password: await hashPassword(password),
        }

        const user = await prisma.user.create({data});

        const token = generateToken({
            email: user.email,
            name: user.name
        });

        res.json({token,data:user});
    }catch(err){
        console.error(err);
        res.status(500).send('Errore del server');
    }
}

const login = (req,res)=>{
    
}

module.exports = {
    registration,
    login
};
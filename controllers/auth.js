const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { hashPassword, comparePassword} = require("../utils/password");
const generateToken = require("../utils/generateToken");
const restError = require ("../utils/restError");
const errorHandler = require("../middlewares/errorHandler");

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
        errorHandler(err,req,res);
    }
}

const login = async (req,res)=>{
    
    try{
        const {email,password} = req.body;

        const user = await prisma.user.findUnique({
            where:{email}
        });

        const eventualeErrore = new restError (`Email o password errati.`, 400);

        if(!user){
            throw eventualeErrore;
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if(!isPasswordValid){
            throw eventualeErrore;
        }

        const token = generateToken({
            email: user.email,
            name: user.name
        })

        res.json({token,data:user});
    }catch(err){
        errorHandler(err,req,res);
    }
}

module.exports = {
    registration,
    login
};
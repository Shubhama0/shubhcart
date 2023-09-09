import JWT from 'jsonwebtoken';


//protected routes token based
export const requiresignin=async(req,res,next)=>{
    try{
const decode=JWT.verify(req.headers.authorization,process.env.JWT_SECRET)

req.user=decode;
next();


    }
    
    catch(error){
        console.log(`error in controller${error}`);
    }
    
    };
    
import nodemailer from "nodemailer";
import { ApiError } from "../utils/apiError.js";
function createTransporter(){
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
return transporter;
}


const sendMail = async(email , subject , content)=>{
    try{
        const transporter = createTransporter();
        console.log(process.env.MAIL_USER , process.env.MAIL_PASS , process.env.MAIL_HOST);
        const mailOptions = {
            from : `GOODMATTER <${process.env.MAIL_USER}>`,
            to : email,
            subject : subject,
            html : content,
        };
        const info = await transporter.sendMail(mailOptions);

        if(!info) throw new ApiError(500 , "Email service failed to provide a response");
        return info;
    }catch(error){
        throw new ApiError( 500,  error?.message || "Internal server error while sending email");
    }
}

export {sendMail};

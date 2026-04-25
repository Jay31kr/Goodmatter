import crypto from "crypto"

export const generateOtp = ()=>{
    const plainOtp = crypto.randomInt(100000,1000000).toString();
    //hashing
    const  hashedOtp=crypto.createHash("sha256")
                            .update(plainOtp)
                            .digest("hex");

    return {plainOtp , hashedOtp}
};

export const getOtpExpiry=(minutes=10)=>{
    return new Date(Date.now()+minutes*60*1000);
}

export const verifyOtp = (plainOtp , hashedOtp)=>{
    console.log("check 2")
    if(!plainOtp || !hashedOtp) return false;
    console.log("check 3");
    console.log(plainOtp);

    const hashToCOmpare=crypto.createHash("sha256")
            .update(plainOtp)
            .digest("hex");
    console.log("check 4")
    return hashToCOmpare == hashedOtp;
}
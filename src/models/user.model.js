import mongoose , {Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = Schema({
    name : {
         type: String,
         required: true,
         trim: true
    },
    email : {
        type : String,
        trim : true,
        unique :true,
        required :true,
        lowercase :true,
    },
    password : {
        type : String,
        required : true , 
        select : false,
    },
    role: {
    type: String,
    enum: ["startup", "investor", "admin"],
    required: true
  },
  isEmailVerified : {
    type : Boolean,
    default : false,
  },
  otpHash : {
    type :String,
    default :null,
    select:false,
  },
  otpExpiry : {
    type : Date,
    default : null,
  },
  otpSentAt : {
    type : Date,
    default :null,
  },
  refreshTokenHash : {
    type : String , 
    default :null , 
    select : false,
  }
},{
    timestamps : true,
});

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return;

    this.password = await  bcrypt.hash(this.password , 10);
    return;
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password , this.password)
};

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            id : this._id,
            role : this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRY},

    )
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            id:this._id,
            role : this.role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn : process.env.REFRESH_TOKEN_EXPIRY},
    )
};

userSchema.methods.generateAccessAndRefreshTokens = async function() {
    try {
        const accessToken = this.generateAccessToken();
        const refreshToken = this.generateRefreshToken();

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const User = mongoose.model("User" , userSchema);

export default User;



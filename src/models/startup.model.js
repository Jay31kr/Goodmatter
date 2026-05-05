import mongoose , {Schema} from "mongoose";

const startupSchema = new Schema({

    founder : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    startupName : {
        type:String,
        trim : true,
        required:true,
    },

    sector : {
        type: String,
        required: true,
        enum: ['Fintech', 'Edtech',  
            'SaaS', 'Healthtech', 'AI/ML', 'Other'],
        default: 'Other'
    },

    customSector : {
        type:String,
        trim:true,
    },

    stage : {
        type:String,
        required:true,
        enum : ['Ideation' , "Pre-seed" , "Seed" , "Series-A" , "Series-B+"],
    },

    raiseGoal : {
        type : Number,
        required:true,
        min : [0, "Goal can not ne negetive"],
    },

    amountRaised : {
        type : Number,
        default : 0,
        min : [0 , "amount raised can't be nevgetive"],
    },

    website : {
        type :String,
        trim : true,
    },

    revenue :{
        type:Number,
        min : [0 , "revenue can't be negetive"],
        default : 0
    },

    teamSize : {
        type :Number,
        min : [1 , "tam size can't be 0 or negetive"],
        default : 1,
    },

    bio : {
        type : String,
        maxLength : [ 500 , "bio can't be of more than 500 character"],
        trim : true,
    },

    pitchDeck : {
        publicId: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    },

    isProfileComplete: {
    type: Boolean,
    default: false
  }
},{
    timestamps : true,
});

startupSchema.index({sector : 1 , stage : 1});

const Startup = mongoose.model("Startup" , startupSchema);

export default Startup;

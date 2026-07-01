import mongoose,
{
 Document,
 Schema
}
from "mongoose";

export interface IUserDocument
 extends Document {

  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  provider:"local" | "google";
  refreshTokens: string[];
}
const UserSchema =
 new Schema<IUserDocument>(
 {
   name: {
     type: String,
     required: true,
   },

   email: {
     type: String,
     required: true,
     unique: true,
     lowercase: true,
     trim: true,
   },

   password: {
     type: String,
     default: null,
   },
    googleId: {
    type: String,
  },
   avatar: {
     type: String,
     default: null,
   },
   provider:{
    type:String,
    enum:["local","google"],
    default:"local"
   },
   refreshTokens:{
    type:[String],
    default:[],
}
 },
 {
   timestamps: true,
 }
);

UserSchema.index({googleId:1},{unique:true,sparse:true});

export default (mongoose.models.User as mongoose.Model<IUserDocument>) ||
  mongoose.model<IUserDocument>("User", UserSchema);
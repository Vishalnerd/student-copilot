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
  password: string;
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
   },

   password: {
     type: String,
     required: true,
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

export default mongoose.model<
 IUserDocument
>(
 "User",
 UserSchema
);
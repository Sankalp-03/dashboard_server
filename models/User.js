import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            min: 2,
            max:100,
        },
        email:{
            type: String,
            required: true,
            max:50,
            unique:true
        },
        password:{
            type: String,
            required: true,
            min: 5,
        },
        city: String,
        state: String,
        country: String, 
        occupation: String,
        phoneNumber: String,
        transactions: Array,
        role: { 
            type: String,
            enum: ["user","admin","superadmin"],
            default: "admin"
        },
    },
    { timestamps : true } //this gives us automatically updated date & time.
);
// the above schema defines the data one has to have of the form, if not required then it is optional
const User = mongoose.model("User", UserSchema);
export default User;
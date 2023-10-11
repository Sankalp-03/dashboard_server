import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
    {
        userId: String,
        cost: String,
        products:{
            type: [mongoose.Types.ObjectId],
            of: Number
        }
    },
    {
        timestamps:true
    }
);
// the above schema defines the data one has to have of the form, if not required then it is optional
const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
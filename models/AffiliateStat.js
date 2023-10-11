import mongoose from "mongoose";

const AffiliateStatSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: "User"}, // ref tells basically to which data model this feature is referring to
        affiliateSales: {
            type: [mongoose.Types.ObjectId],
            ref: "Transaction"
        }
    },
    {
        timestamps:true
    }
);
// the above schema defines the data one has to have of the form, if not required then it is optional
const AffiliateStat = mongoose.model("AffiliateStat", AffiliateStatSchema);
export default AffiliateStat;
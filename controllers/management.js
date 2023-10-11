import mongoose, { Mongoose } from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getAdmins = async( req, res ) => {
    try {
        const admins = await User.find({ role: "admin" }).select("-password");
        res.status(200).json(admins);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getUserPerformance = async(req,res) => {
    try {
        const { id } = req.params;

        // basically gives the user Info. along with the affiliateStats object
        const userWithStats = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) }}, // grabbing the specific current user that has the particular id
            {
                $lookup: {
                    from:"affiliatestats",
                    localField: "_id",
                    foreignField: "userId",
                    as: "affiliateStats",
                    // looking up in the AffiliateStats table, we compare the current user id with that of userId in the affiliateStats model saving that
                    // in a property called as affiliateStats 
                }
            },
            {
                $unwind : "$affiliateStats" // flattening of array / object
            }
        ]);


        const saleTransactions = await Promise.all(
            //userWithStats has the affiliateStats option which further contains the affiliateSales in it
            userWithStats[0].affiliateStats.affiliateSales.map((id) => {
                return Transaction.findById(id) // for each one of the user with get the Transactions for each one of them
            })
        );
        // filtering transactions which become null
        const filteredSaleTransactions = saleTransactions.filter(
            (transaction) => transaction !== null
        );
        res.status(200).json({ user: userWithStats[0], sales: filteredSaleTransactions})
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
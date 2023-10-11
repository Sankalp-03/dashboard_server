import mongoose from "mongoose";

const OverallStatSchema = new mongoose.Schema(
    {
        totalCustomers: Number,
        yearlySalesTotal: Number,
        yearlyTotalSoldUnits: Number,
        year: Number,
        monthlyData:
        // creating an list of objects with the following property 
        [
            {
                month: String,
                totalSales: Number,
                totalUnits: Number
            }
        ],
        dailyData: [{
            date: String,
            totalSales: Number,
            totalUnits: Number,
        }],
        salesByCategory: {
            type: Map,
            of: Number,
        },
    },
    {
        timestamps:true
    }
);
// the above schema defines the data one has to have of the form, if not required then it is optional
const OverallStat = mongoose.model("OverallStat", OverallStatSchema);
export default OverallStat;
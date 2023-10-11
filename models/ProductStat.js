import mongoose from "mongoose";

const ProductStatSchema = new mongoose.Schema(
    {
        productId: String,
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
        dailyData: [
            {
            date: String,
            totalSales: Number,
            totalUnits: Number,
        }],
    },
    {
        timestamps:true
    }
);
// the above schema defines the data one has to have of the form, if not required then it is optional
const ProductStat = mongoose.model("ProductStat", ProductStatSchema);
export default ProductStat;
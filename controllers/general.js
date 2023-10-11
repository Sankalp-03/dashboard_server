import User from "../models/User.js";
// import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";
import OverallStat from "../models/OverallStat.js";

export const getUser = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id); // finding user from the id (i.e. getting it from the params of the route formed for getUser)
        res.status(200).json(user); // sending user info to frontend
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getDashboardStats = async(req,res) => {
    try {
        // setting the value of some hardcoded vars for generating graphs
        const currentMonth = "October";
        const currentYear = 2021;
        const currentDay = 2021-10-10;

        const transactions = await Transaction.find().limit(50).sort({ createOn: -1 }); //generating 50 transactions, sorted in opposite order   

        const overallStat = await OverallStat.find({ year: currentYear }); // finding overallStat for an year

        const { totalCustomers, yearlyTotalSoldUnits, yearlySalesTotal, monthlyData, salesByCategory } = overallStat[0];

        const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
            return month === currentMonth;
        })

        const todayStats = overallStat[0].dailyData.find(({ date }) => {
            return date === currentDay;
        })

        res.status(200).json({ totalCustomers, yearlyTotalSoldUnits, yearlySalesTotal, monthlyData, salesByCategory, thisMonthStats, todayStats, transactions })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
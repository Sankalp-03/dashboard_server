import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import getCountryIso3 from "country-iso-2-to-3";
export const getProducts = async( req, res ) => {
    try {
        const products = await Product.find(); // gives all the products that we just requested
        const productsWithStats = await Promise.all( // promise.all takes an iterable of promises as input and returns a single promise
            products.map(async( product ) => {
                // product array is mapped over and an async function is created for each product's stat.
                const stat = await ProductStat.find({
                    productId: product._id
                })
                return {
                    ...product._doc,
                    stat,
                }
            })
        )
        res.status(200).json(productsWithStats);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getCustomers = async( req, res ) => {
    try {
        const customers = await User.find({ role: "user" }).select("-password"); // "-password removes the password from the customers display, as we shouldn't show the password of individual"
        res.status(200).json(customers);
        // people with user tag are gonna be our customers, admin and people can access the dashboard, superAdmin and people will be able to access and manage other admins
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getTransactions = async(req,res) => {
    try {
        // since we are doing server side pagination hence we need to grab some values from our query string
        const { page = 1, pageSize = 20, sort = null, search = " "} = req.query; // grabbing this from frontend using req.query

        const generateSort = () => {
            const sortParsed = JSON.parse(sort); // parse the query into an object, frontend wll be sending query like : {"field":"userId", "sort":"desc"}
            const sortFormatted = {
                [sortParsed.field]: sortParsed.sort = "asc" ? 1 : -1 // take out the sort from sortParsed, if asc then 1 else -1
            };
            return sortFormatted;
        }
        const sortFormatted = Boolean(sort) ? generateSort() : {}; // if sort exists then call the generateSort fnc. else not.
        
        // finding all the transactions that we have
        const transactions = await Transaction.find({
            $or: [
                { cost: { $regex: new RegExp(search,"i") } },
                { userId: { $regex: new RegExp(search,"i") } } // since we can't search every single column hence we will search only these two columns
            ]
        })
        .sort(sortFormatted) // sort the results of a query in the specified order
        .skip(page * pageSize) // skips the first n transactions in the result
        .limit(pageSize) // limits the result to the first n transactions

        // finding the total no. of documents that exist
        const total = await Transaction.countDocuments({
            name: { $regex: search, $options: "i" }
        })
        res.status(200).json({
            transactions,
            total
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


export const getGeogrpahy = async (req,res) => {
    try{
        const users = await User.find();
        const mappedLocations = users.reduce(( acc, { country } ) => {
            const countryISO3 = getCountryIso3(country); // convert country into proper format that we need i.e. into 3 letter code for the country
            if(!acc[countryISO3]){
                acc[countryISO3] = 0; // if country does not exist then set the value of it to 1
            }
            acc[countryISO3]++; // after adding the country to the list, increment its count value.
            return acc;
        }, {}); // reducers start with the empty object and we can add things to it
        const formattedLocations = Object.entries(mappedLocations).map( // the mappedLocation contains country, count as the key value pair
            ([country, count]) => {
                return { id: country, value: count } // making an object of id, value
            }
        )
        res.status(200).json(formattedLocations);
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}
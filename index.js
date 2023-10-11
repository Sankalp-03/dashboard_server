import express from "express";
import bodyParser from "body-parser"; //used to process data sent through an HTTP request body
import mongoose from "mongoose";
import cors from 'cors';
//Cross origin resource sharing - a mechanism by which a front-end client can make requests for resources to an external back-end server
import helmet from "helmet"; //helps protect your server from some well-known web vulnerabilities by setting HTTP response headers appropriately
import dotenv from 'dotenv';
import morgan from "morgan";//logging HTTP requests and responses in Node. js applications
import clientRoutes from "./routes/client.js";
import salesRoutes from "./routes/sales.js";
import managementRoutes from "./routes/management.js";
import generalRoutes from "./routes/general.js";
import User from "./models/User.js"; // importing the raw data
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";
import { dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat, dataAffiliateStat } from "./data/index.js";

dotenv.config();
const app = express();
app.use(express.json()); // parse the json requests
app.use(helmet()); // tells Express to use the helmet middleware to set a variety of security-related HTTP headers.
app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin" })) 
//middleware to allow the cross-origin sharing requests, required when u make api calls from another server
app.use(morgan("common")); //tells express to log the incoming http requests in the "common" format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
//urlencoded - a form of data encoding that is used in API calls to pass data within a query string
//above line parses these urlencoded reqsts.
app.use(cors());//cors middleware to allow the cross-origin sharing requests, required when u make api calls from another server


/* SETTING UP SOME ROUTES */
app.use("/client", clientRoutes); //represents the client-facing section routes
app.use("/general",generalRoutes); // represents routes for getting users and for dashboard purposes
app.use("/management",managementRoutes); //represents the management section routes
app.use("/sales",salesRoutes); //represents the sales section routes


/* SETTING UP MONGOOSE */
const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true, // set to use the new mongodb connec string, if error then shift to the old string
    useUnifiedTopology: true, // set to use the new server discovery
}).then(() => {
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
    // User.insertMany(dataUser); // only adds data one time to avoid duplicates
    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // Transaction.insertMany(dataTransaction);
    // OverallStat.insertMany(dataOverallStat);
    // AffiliateStat.insertMany(dataAffiliateStat);
}).catch((error) => console.log(`${error} didn't connect`));
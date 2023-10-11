import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: String,
        price: Number,
        description: String,
        category: String,
        rating: Number,
        supply: Number,
    },
    {
        timestamps:true
    }
);
// the above schema defines the data one has to have of the form, if not required then it is optional
const Product = mongoose.model("Product", ProductSchema);
export default Product;
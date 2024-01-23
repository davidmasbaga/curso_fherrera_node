const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const colors = require("colors");
const { User, Category, Product } = require("../models");

const allowedCollections = ["users", "categories", "products", "roles"];

const searchUsers = async (term = "", res = response) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const user = await User.findById(term);
        return res.status(200).json({
            results: user ? [user] : [],
        });
    }

    const regex = new RegExp(term, "i"); //no sensible a mayusculas o minúsculas

    const query = {
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }],
    };

    const [counter, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query),
    ]);

    res.status(200).json({
        total: counter,
        results: users,
    });
};

const searchCategory = async (term = "", res = response) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const category = await Category.findById(term);
        return res.status(200).json({
            results: category ? [category] : [],
        });
    }

    const regex = new RegExp(term, "i"); //no sensible a mayusculas o minúsculas

    const query = { $and: [{ name: regex }, { status: true }] };

    const [counter, category] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query),
    ]);

    res.status(200).json({
        total: counter,
        result: category,
    });
};

const searchProducts = async (term = "", res = response) => {
    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const product = await Product.findById(term)

        ;
        return res.status(200).json({
            results: product ? [product] : [],
        });
    }

    const regex = new RegExp(term, "i"); //no sensible a mayusculas o minúsculas

    const query = {
        $or: [
            { name: regex }           
        ],
        $and: [{ status: true }],
    };

    const [counter, product] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query).populate('category','name'),
    ]);

    res.status(200).json({
        total: counter,
        result: product,
    });
};

const search = (req, res = response) => {
    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) {
        console.log(
            `${colors.red(`[Search Error]`)} not allowed collection: ${collection}`
        );
        return res.status(400).json({
            msg: `The allowed collections are: ${allowedCollections}`,
        });
    }

    switch (collection) {
        case "users":
            searchUsers(term, res);
            break;
        case "categories":
            searchCategory(term, res);
            break;
        case "products":
            searchProducts(term, res)
            break;

        default:
            res.status(500).json({ msg: "Do not found" });
    }
};

module.exports = { search };

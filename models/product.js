const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    madeIn: {
        type: String,
        required: true
    },
    season: {
        type: String,
        required: true
    },
    // productImage: {
    //     type: String,
    //     required: true
    // }
    productImage: {
        type: Buffer,
        required: true
    },
    productImageType: {
        type: String,
        required: true
    }
})

productSchema.virtual('productImagePath').get(function() {
    if(this.productImage && this.productImageType) {
        return `data:${this.productImageType};charset=utf-8;base64,${this.productImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Product', productSchema);
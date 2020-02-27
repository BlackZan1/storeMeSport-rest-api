const mongoose = require('mongoose');
const Types = mongoose.Types;

const cartSchema = new mongoose.Schema({
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        unique: true
    },
    products: {
        type: Array,
        default: []
    },
    waitingList: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Cart', cartSchema);
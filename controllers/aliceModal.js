
const mongoose = require('mongoose');
let   Schema = mongoose.Schema;
let coinPriceSchema = new Schema();

let coinPrice = mongoose.model('coinPrice', coinPriceSchema);

module.exports = coinPrice;
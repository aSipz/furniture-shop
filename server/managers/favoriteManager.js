const Favorite = require('../models/Favorite');

exports.getByOwnerAndProduct = (owner, product) => Favorite.findOne({ owner, product });

exports.create = (owner, product) => Favorite.create({ owner, product });

exports.delete = (owner, product) => Favorite.deleteOne({ owner, product });

exports.getProductsIdByUser = (owner) => Favorite.find({owner}, {product: 1, _id:0});

// exports.getAll = (search, limit, skip, sort, include) => {

//     let searchCriteria = {};

//     if (search) {
//         searchCriteria = JSON.parse(search);
//     }

//     const sortObj = sort
//         ? sort.split(',')
//             .map(e => e)
//             .reduce((acc, curr) => {
//                 const key = curr.startsWith('-') ? curr.slice(1) : curr;
//                 acc[key] = curr.startsWith('-') ? -1 : 1;
//                 return acc;
//             }, {})
//         : {};

//     const fieldsToPopulate = [];

//     if (include) {
//         const fields = include.split(',').map(e => e).map(e => e.trim());
//         fields.forEach(f => {
//             fieldsToPopulate.push({ path: f });
//         });
//     }

//     const projectionCriteria = { __v: 0 };

//     return Promise.all([
//         Favorite.find(searchCriteria, projectionCriteria)
//             .limit(limit && +limit)
//             .skip(skip && +skip)
//             .sort(sortObj)
//             .populate(include && fieldsToPopulate),
//         Favorite.find(searchCriteria, projectionCriteria).count()
//     ]);

// };

exports.deleteByProduct = (product) => Favorite.deleteMany({ product });
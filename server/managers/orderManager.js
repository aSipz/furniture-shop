const Order = require('../models/Order');

exports.create = (orderData) => Order.create(orderData);

exports.getById = (orderId) => Order.findById(orderId);

exports.getAll = (search, limit, skip, sort, include) => {

    let searchCriteria = {};

    if (search) {
        searchCriteria = JSON.parse(search);
        if (searchCriteria.createdAt) {

            if (searchCriteria.createdAt['$gte']) {
                searchCriteria.createdAt['$gte'] = +searchCriteria.createdAt['$gte'];
            }

            if (searchCriteria.createdAt['$lte']) {
                const date = new Date(+searchCriteria.createdAt['$lte'])
                searchCriteria.createdAt['$lte'] = date.setDate(date.getDate() + 1);
            }
        }
    }

    const sortObj = sort
        ? sort.split(',')
            .map(e => e)
            .reduce((acc, curr) => {
                const key = curr.startsWith('-') ? curr.slice(1) : curr;
                acc[key] = curr.startsWith('-') ? -1 : 1;
                return acc;
            }, {})
        : {};

    const fieldsToPopulate = [];

    if (include) {
        const fields = include.split(',').map(e => e).map(e => e.trim());
        fields.forEach(f => {
            fieldsToPopulate.push({ path: f });
        });

    }

    const projectionCriteria = { __v: 0 };

    return Promise.all([
        Order.find(searchCriteria, projectionCriteria)
            .limit(limit && +limit)
            .skip(skip && +skip)
            .sort(sortObj)
            .populate(include && fieldsToPopulate),
        Order.find(searchCriteria, projectionCriteria).count()
    ]);

};

exports.edit = (orderId, orderData) => Order.findByIdAndUpdate(orderId, orderData, { runValidators: true, new: true });
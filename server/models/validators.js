function httpValidator(val) {
    return val.startsWith('http://') || val.startsWith('https://')
}

function positiveValidator(val) {
    return val > 0;
}

const httpVal = [httpValidator, 'ImageUrl should start with http:// or https://'];
const positiveVal = [positiveValidator, 'Price should be positive'];

module.exports = {
    httpVal,
    positiveVal
}
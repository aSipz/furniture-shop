const normalizeValue = (value, name) => {
    let result = value.trim().toLowerCase();
    if (!name) {
        return result;
    }

    return result.slice(0, 1).toUpperCase() + result.slice(1);
}

const normalizeObjectValues = (obj) => {
    for (const key in obj) {
        obj[key] = normalizeValue(obj[key], key.includes('Name') ? true : false);
    }

    return obj;
}

module.exports = normalizeObjectValues;
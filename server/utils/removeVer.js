const removeVer = (data) => {
    const {  __v, ...newData } = data;
    return newData;
}

module.exports = removeVer;
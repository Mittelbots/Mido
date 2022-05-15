module.exports.premium = new Set();
module.exports.permissions = new Set();
module.exports.config = new Set();
module.exports.global = new Set();

/**
 * 
 * @param {Object} values - Object containing the values to be inserted
 * @returns {Boolean}
 */
module.exports.addToCache = async ({value}) => {
    if(!value) return false;
  
    this[value.name].add({
        ...value
    });
}

module.exports.getFromCache = async ({cacheName, param_id}) => {
    if(!cacheName || !param_id) return false;
    
    let response = [];
    this[cacheName].forEach(cacheValue => {
        if(cacheValue.id === param_id) {
            response.push(cacheValue)
        }
    })

    return (response.length > 0) ? response : false;
}


module.exports.updateCache = async ({cacheName, param_id, updateVal}) => {
    if(!cacheName || !param_id || !updateVal) return false;
    this[cacheName].forEach(cacheValue => {
        if(cacheValue.id === param_id) {
            for (const [index, [key, value]] of Object.entries(Object.entries(updateVal))) {
                cacheValue[key] = value;
            }
        }
    });
}

module.exports.deleteFromCache = async ({cacheName, param_id}) => {
    if(!cacheName || !param_id) return false;

    this[cacheName].forEach(cacheValue => {
        if(cacheValue.id === param_id) {
            this[cacheName].delete(cacheValue);
        }
    });
}
module.exports.premium = new Set();
module.exports.permissions = new Set();
module.exports.config = new Set();

/**
 * 
 * @param {Object} values - Object containing the values to be inserted
 * @returns {Boolean}
 */
module.exports.addToCache = ({value}) => {
    if(!value) return false;
  
    this[value.name].add({
        ...value
    });
}

module.exports.getFromCache = ({cacheName, param_id}) => {
    if(!cacheName || !param_id) return false;
    
    let response;
    this[cacheName].forEach(cacheValue => {
        if(cacheValue.id === param_id) {
            return response = cacheValue;
        }
    })
    return response;
}


module.exports.updateCache = ({cacheName, param_id, value}) => {
    if(!cacheName || !param_id || !value) return false;

    this[cacheName].forEach(cacheValue => {
        if(cacheValue.id === param_id) {
            cacheValue = value;
        }
    });
}

module.exports.deleteFromCache = ({cacheName, param_id}) => {
    if(!cacheName || !param_id) return false;

    this[cacheName].forEach(cacheValue => {
        if(cacheValue.id === param_id) {
            this[cacheName].delete(cacheValue);
        }
    });
}
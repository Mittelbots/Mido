module.exports.getUptime = () => {
    const currentUptime = process.uptime().toFixed(0);

    if(currentUptime < 60) {
        return `${currentUptime} seconds`;
    } else if(currentUptime < 3600) {
        return `${Math.floor(currentUptime / 60)} minutes`;
    } else if(currentUptime < 86400) {
        return `${Math.floor(currentUptime / 3600)} hours`;
    } else if(currentUptime < 604800) {
        return `${Math.floor(currentUptime / 86400)} days`;
    } else if(currentUptime < 2592000) {
        return `${Math.floor(currentUptime / 604800)} weeks`;
    } else if(currentUptime < 31536000) {
        return `${Math.floor(currentUptime / 2592000)} months`;
    } else {
        return `${Math.floor(currentUptime / 31536000)} years`;
    }

}
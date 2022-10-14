module.exports.removeMention = (mention) => {
    return (mention = mention
        .replaceAll('<', '')
        .replaceAll('@', '')
        .replaceAll('!', '')
        .replaceAll('&', '')
        .replaceAll('>', ''));
};

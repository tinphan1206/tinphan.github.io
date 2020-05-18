let uuid = () => {
    return `xxxx-xxxx-xxxx-xxxxxxxxx-${Date.now()}`.replace(/x/g, () => {
        return Math.floor(Math.random() * 16).toString(16);
    })
};
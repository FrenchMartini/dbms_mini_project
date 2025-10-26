// Socket.IO instance manager
let socketIOInstance = null;

// Set the Socket.IO instance
function setSocketIO(io) {
    socketIOInstance = io;
}

// Get the Socket.IO instance
function getSocketIO() {
    return socketIOInstance;
}

module.exports = {
    setSocketIO,
    getSocketIO
};

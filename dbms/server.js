// The server.js file is the main file of your Node.js application 
// It will load the express.js file as a module to bootstrap your Express application
//
//The process.env.NODE_ENV variable is set to the default 'development'
//value if itdoesn 't exist.
// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
    // Load the module dependencies
    var mongoose = require('./config/mongoose'),
        express = require('./config/express'),
        http = require('http'),
        socketIo = require('socket.io');

    // Create a new Mongoose connection instance
    var db = mongoose();
    // Create a new Express application instance
    var app = await express();

// Create HTTP server
var server = http.createServer(app);

// Initialize Socket.IO
var io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join course room for real-time updates
    socket.on('join-course-room', (courseCode) => {
        socket.join(`course-${courseCode}`);
        console.log(`User ${socket.id} joined course room: ${courseCode}`);
    });

    // Leave course room
    socket.on('leave-course-room', (courseCode) => {
        socket.leave(`course-${courseCode}`);
        console.log(`User ${socket.id} left course room: ${courseCode}`);
    });

    // Handle enrollment updates
    socket.on('enrollment-update', (data) => {
        socket.to(`course-${data.courseCode}`).emit('enrollment-changed', data);
    });

    // Handle course capacity updates
    socket.on('capacity-update', (data) => {
        socket.to(`course-${data.courseCode}`).emit('capacity-changed', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('io', io);

    // Use the HTTP server to listen to the '5001' port
    server.listen(5001);
    // Use the module.exports property to expose our Express application instance for external usage
    module.exports = app; //returns the application object
    // Log the server status to the console
    console.log('Server running at http://localhost:5001/');
    console.log('Socket.IO server initialized on port 5001');
    console.log('GraphQL server running at http://localhost:5001/graphql');
}

// Start the server
startServer().catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
});

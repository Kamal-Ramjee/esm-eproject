const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require("socket.io");
const connectDB = require('./src/config/db');

// Config
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/expos', require('./src/routes/expoRoutes'));
app.use('/api/exhibitors', require('./src/routes/exhibitorRoutes'));
app.use('/api/attendees', require('./src/routes/attendeeRoutes'));
app.use('/api/stats', require('./src/routes/statsRoutes'));
app.use('/api/sessions', require('./src/routes/sessionRoutes'));

// Real-time Socket Connection (For updates/chat)
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Example: Join an Expo room for live updates
    socket.on('join_expo', (expoId) => {
        socket.join(expoId);
    });

    // Example: Organizer updates schedule
    socket.on('update_schedule', (data) => {
        io.to(data.expoId).emit('schedule_updated', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
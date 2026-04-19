const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Attach io to req so controllers can use it
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/members', require('./routes/members'));
app.use('/relations', require('./routes/relations'));
app.use('/stats', require('./routes/stats'));
app.use('/search', require('./routes/search'));

// Add simple hello route
app.get('/', (req, res) => res.send('Genoa API is running'));

// Socket.io for locks and real-time refresh
const activeLocks = {}; // { memberId: userId }

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('request_lock', ({ memberId, userId }) => {
    if (activeLocks[memberId] && activeLocks[memberId] !== userId) {
      socket.emit('lock_denied', { memberId });
    } else {
      activeLocks[memberId] = userId;
      socket.emit('lock_granted', { memberId });
      socket.broadcast.emit('member_locked', { memberId, userId });
    }
  });

  socket.on('release_lock', ({ memberId, userId }) => {
    if (activeLocks[memberId] === userId) {
      delete activeLocks[memberId];
      socket.broadcast.emit('member_unlocked', { memberId });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Cleanup locks? We don't have mapping socket -> userId easily here without auth on socket
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

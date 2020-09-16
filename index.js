/** @format */

const app = require('express')();

const http = require('http').createServer(app);

const io = require('socket.io')(http);

const cors = require('cors');

require('dotenv').config();

app.use(cors());

const port = process.env.PORT || '4000';

io.on('connection', (socket) => {
	console.log('connect');
	socket.on('join', ({ name, room }, callback) => {
		console.log(name, room);
		socket.emit('message', {
			user: 'Admin',
			message: `${name},welcome to ${room}`,
		});
		socket.broadcast
			.to(room)
			.emit('message', { user: 'admin', message: `${name} just joined.` });
		socket.join(room);
		callback();
	});

	socket.on('sendMessage', (data) => {
		io.to('global').emit('message', { user: data.name, message: data.message });
		console.log(data);
	});

	socket.on('disconnect', (data) => {
		socket.emit('message', { user: 'Admin', message: `${data.name} left` });
		console.log('discount');
	});
});

http.listen(port, () => {
	console.log('SERVER IS UP');
});

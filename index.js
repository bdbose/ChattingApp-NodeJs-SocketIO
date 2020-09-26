/** @format */

const app = require('express')();

const http = require('http').createServer(app);

const io = require('socket.io')(http);

const cors = require('cors');

require('dotenv').config();

app.use(cors());

const port = process.env.PORT || '4000';

const Time = () => {
	return new Date().toLocaleTimeString();
};

let client = 0;

io.on('connection', (socket) => {
	console.log('connect');
	client++;
	socket.on('join', ({ name, room }, callback) => {
		socket.emit('message', {
			user: 'Admin',
			message: `${name},welcome to ${room}`,
			time: Time(),
			count: client,
		});

		socket.broadcast.to(room).emit('message', {
			user: 'Admin',
			message: `${name} just joined.`,
			time: Time(),
		});
		socket.join(room);
		callback();
	});
	socket.on('sendMessage', (data) => {
		io.to('global').emit('message', {
			user: data.name,
			message: data.message,
			time: Time(),
		});
		console.log(data);
	});
	socket.on('disconnect', (data) => {
		client--;
		socket.on('dis', (data) => {
			console.log(data);
		});
		console.log('discount', data);
	});
});

http.listen(port, () => {
	console.log('SERVER IS UP at', port);
});

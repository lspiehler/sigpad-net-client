var SerialPort = require('serialport');
var net = require('net');

var client;

const com = process.argv[2];
const baud = parseInt(process.argv[3]);
const ip = process.argv[4];
const tcpport = process.argv[5];

var connected = false;
var connecting = false;

var connectToServer = function(callback) {
	
	client = new net.Socket();
	
	client.connect(tcpport, ip, function() {
		//client.write('Hello, server! Love, Client.');
	});
	
	client.on('connect', function(data) {
		console.log('Connected');
		connected = true;
		connecting = false;
		callback(false, client);
	});
	
	client.on('data', function(data) {
		//console.log('Received');
		//if(data.equals(eot)) {
			//if(init) {
			//	console.log('EOT received as response to my connection');
			//} else {
			//	console.log('EOT received because someone else is connecting. Disconnect!');
			//	client.destroy();
			//}
		//	init = false;
		//}
		console.log('Receiving from network serial device');
		console.log(data);
		//client.destroy(); // kill client after server's response
		port.write(data);
	});

	client.on('close', function() {
		console.log('Connection closed');
		connected = false;
		connecting = false;
		/*setTimeout(function() {
			console.log('Attempting reconnect');
			connectToServer();
		}, 10000);*/
	});

	client.on('error', function(e) {
		console.log('Connection error');
		callback(e, client);
		/*setTimeout(function() {
			console.log('Attempting reconnect');
			connectToServer();
		}, 10000);*/
	});
}

var comport = com;
var port = new SerialPort(comport, {
	autoOpen: false,
	baudRate: baud,
	parity: 'odd'
});

var connectPort = function() {
	port.open(function (err) {
		if (err) {
			setTimeout(function() {
				connectPort();
			}, 10000);
			return console.log('Error opening port: ', err.message);
		}

		// Because there's no callback to write, write errors will be emitted on the port:
		//port.write('main screen turn on');
		console.log('com port opened');
	});
}

connectPort();

// The open event is always emitted
port.on('open', function() {
	// open logic
	console.log('port opened');
});

port.on('error', function(e) {
	// open logic
	console.log('ERROR on COM port: ' + e);
});

//var dc1 = new Buffer([17]);
//var eot = new Buffer([4]);
//var match = false;
//var init = false;

port.on('data', function (data) {
	//if(data.equals(dc1)) {
	//	console.log('true');
	//	match = true;
	//} else {
	//	if(match && data.equals(eot)) {
	//		console.log('Received init sequence. Start connection.');
	//		init = true;
			if(!connected) {
				if(connecting) {
					console.log('Still Trying to connect');
				} else {
					connecting = true;
					console.log('Not connected. connecting...');
					connectToServer(function(err, socket) {
						if(err) {
							console.log('connection failed');
						} else {
							client = socket;
							//socket.write(dc1);
							//socket.write(eot);
							socket.write(data);
						}
					});
				}
			} else {
				client.write(data);
			}
			console.log('Sending to network serial device');
			console.log(data);
	//	} else {
	//		client.write(data);
	//	}
	//	match = false;
	//}
	//console.log(data);
	//bufferarr.push(data);
	//console.log(client);
	//if(noend.equals(data)) {
		//console.log('add to buffer');
		//bufferarr.push(data);
	//} else {
		//bufferarr.push(data);
	//console.log('Sending');
	//console.log(data);
	//bufferarr.length = 0;
	//}
	//console.log(data);
});

/*port.on('readable', function () {
	var data = port.read();
	
	console.log(data);
	client.write(data);
});*/
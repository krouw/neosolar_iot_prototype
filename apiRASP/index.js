import SerialPort from 'serialport'

const portName = '/dev/ttyACM0'
let payload = {}

const port = new SerialPort(portName,{
	baudrate: 9600,
	parser: SerialPort.parsers.readline('\n')
});

port.on('data', (data) => {
	//console.log(data.toString());
	let measure = 0
	measure = parseFloat(data.toString());
	console.log(measure);
})

import SerialPort from 'serialport'
import axios from 'axios'

const portName = '/dev/ttyACM0'
const server = 'http://localhost:7000/api'
const device_id = ''
const token = ''
let payload = {}

const port = new SerialPort(portName,{
	baudrate: 9600,
	parser: SerialPort.parsers.readline('\n')
});

const acquisition = port.on('open', data => {
	axios.post(server + '/auth/device', data)
		.then( data => {
			token = data.token

			//Data acquisition Arduino SerialPort
			port.on('data', (data) => {
				let measure = 0
				measure = parseFloat(data.toString());
			})
		})
		.catch( err => {
			console.log(err);
		})
})

export default acquisition;

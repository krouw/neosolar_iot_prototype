var SerialPort = require("serialport")
var portName = '/dev/ttyACM0'
var payload = {}

var port = new SerialPort(portName , function(err){
	if(err) return console.log(err)

	port.on('data', function(data){
		console.log('data: '+data)
		payload.measure = data.toString()
		payload.date = new Date()
		console.log(payload)
	})
})

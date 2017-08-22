import mosca from 'mosca'
import http from 'http'
import mongoose from 'mongoose'
import { moscaSettings, MONGO } from './config/config'
import { Authenticate,
				 AuthorizePublish,
				 AuthorizeSubscribe } from './auth/auth'
import { isJSON } from './util/isJSON'
import { actions } from './actions'

const database  = process.env.MONGO_URL || MONGO.uri

mongoose.Promise = global.Promise; //mongoose uso de promesas es6
mongoose.connect(database);

var server = new mosca.Server(moscaSettings);
var httpServer = http.createServer()

server.attachHttpServer(httpServer)

server.on('ready', setup);

server.on('clientConnected', function(client) {
	console.log('client connected --> ', client.id);
});

// fired when a client disconnects
server.on('clientDisconnected', function(client) {
	console.log('Client Disconnected --> ', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  //console.log('Published', packet.topic, packet.payload.toString());
	if(isJSON(packet.payload.toString())) {
		const payload = JSON.parse(packet.payload.toString())
		actions(payload)
	}

});

server.on("error", (err) => {
    console.log(err);
});

var message = {
  topic: 'device/#',
  payload: 'Todos los devices', // or a Buffer
};

function send(){
  setTimeout(function(){
    server.publish(message, function() {
      //console.log('done!');
    });
  }, 9000)
}

send()

// fired when the mqtt server is ready
function setup() {
	server.authenticate = Authenticate;
	server.authorizePublish = AuthorizePublish;
	server.authorizeSubscribe = AuthorizeSubscribe;
  console.log('MQTT server is up and running on port 1883')
}

httpServer.listen(9001, () => {
	console.log('HTTP Server run on port 9001');
});

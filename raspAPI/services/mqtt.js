import mqtt from 'mqtt'
import { getAuthorizationToken } from '../auth/auth'
import { ID, MQTT, MEASUREMENT } from '../config/config'

export const publish = (payload) => {
  const auth = getAuthorizationToken()

  if (!MQTT && !auth) {
    return;
  }

  let mqtt_hostname = MQTT;
  let mqtt_topic = 'device/'+ID;

  let options = {
       username: ID,
       password: auth.token,
       clientId: ID,
   };

   payload.device = ID

   const data = JSON.stringify({ data: payload, type: MEASUREMENT });
   console.log('< ================ >\n');
   console.log('Publishing to MQTT service.');
   const client = mqtt.connect(mqtt_hostname, options)
   client.on('connect', function () {
        console.log('MQTT topic: {0}.', mqtt_topic);
        client.publish(mqtt_topic, data);
        console.log('MQTT message published: {0}.', data);
        client.end();
        console.log('\n');
  });

}

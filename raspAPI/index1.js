import Meter from './Meter'
import { ID, PASSWORD, HTTP, MQTT } from './config/config'

const SmartMeter = new Meter(ID, PASSWORD, HTTP, MQTT)

async function bootstrap() {
  await SmartMeter.auth()
  await SmartMeter.connectMQTT()
  //SmartMeter.startAdquisition(SmartMeter.fakeMeter, 1000)

}

bootstrap()

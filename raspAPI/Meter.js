import axios from 'axios'
import { customPostRequestHttp } from './services/http'
import { setAuthorizationToken } from './util/setAuthorizationToken'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import mqtt from 'mqtt'

export default class Meter{

  constructor(id, password, http, mqtt) {
    this.id = id
    this.password = password
    this.http = http
    this.mqtt = mqtt
    this.token = ''
    this.name = ''
    this.mqttClient = {}
    this.mqttIntents = 0
  }

  log(message) {
    console.log(message);
  }

  async auth() {
    this.log('==> AUTH')
    try {
      const res = await customPostRequestHttp(`${this.http}/auth/device`,{ id: this.id, password: this.password })
      const { token, name } = res.data
      this.token = token
      this.name = name
      setAuthorizationToken(token)
      this.log('==> Authorization Granted')
    } catch (err) {
      this.log('==> Authorization Denied')
      this.log(`==> Error ${err}`)
      setAuthorizationToken()
      this.token = ''
    }
  }

  getAuthorizationToken() {
    return this.token
  }

  async checkToken() {
    console.log('check');
    const token = this.token
    if(!isEmpty(token)){
      const decoded = jwt.decode(token.split(' ')[1])

      if (decoded.exp && (moment.unix(decoded.exp) - moment(Date.now()) < 5000)) {
        this.log('==> Token Expired')
        await this.auth()
        return
      }
      else {
        return
      }
    }
  }

  async acquisition(sensor) {
    this.log('==> Adquisition')
  }

  startAdquisition(sensor ,interval) {
    setInterval(() => {
      this.acquisition(sensor)
    }, interval)
  }

  fakeMeter() {
    return new Promise((resolve, reject) => {
  		  let msm = {
  		    intensity: (Math.random() * (14.0000 - 1.0000) + 1.000).toFixed(4),
  		    voltageTotal: (Math.random() * (14.0000 - 1.0000) + 1.000).toFixed(4),
  				battery: {
  					battery1: (Math.random() * (14.0000 - 1.0000) + 1.000).toFixed(4),
  					battery2: (Math.random() * (14.0000 - 1.0000) + 1.000).toFixed(4),
  					battery3: (Math.random() * (14.0000 - 1.0000) + 1.000).toFixed(4),
  					battery4: (Math.random() * (14.0000 - 1.0000) + 1.000).toFixed(4)
  				},
  				createAt: moment().format(),
  		  }
  		  resolve({
  		    msm: msm
  		  })
  	});
  }

  async connectMQTT () {
    this.log('==> Estableciendo conexión MQTT...')
    if (!this.mqtt) {
      this.log('==> Error: Broker MQTT not found')
      return
    }
    await this.checkToken()

    const options = {
      username: this.id,
      password: this.token,
      clientId: this.id,
      reconnectPeriod: 10000
    }

    this.mqttClient = mqtt.connect(this.mqtt, options)
    this.eventsMQTT()
  }

  eventsMQTT () {
    this.mqttClient.on('connect', (conn) => {
      this.log(`==> Conexión MQTT Broker bidireccional establecida ${moment().format("YYYY-MM-DDTHH:mm:ss")} UTC`)
      this.mqttIntents = 0
    })

    this.mqttClient.on('reconnect', () => {
      this.log('==> Reconectando MQTT...')
      this.checkToken()
    })

    this.mqttClient.on('offline', () => {
      this.log('==> Disposito offline :(')
    })

    this.mqttClient.on('close', (err) => {
      this.log('==> Conexión MQTT Cerrada', err)
      this.mqttIntents += 1
     })

    this.mqttClient.on('error', (err) => {

      this.log('==> Error de conexion MQTT ', err)
      if( this.mqttIntents > 3 ) {
        this.mqttClient.end()
        this.connectMQTT()
      }

    })
  }
}

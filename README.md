# NeoSolar

##### Prototype Internet of Thigns four layers.

1. Perception Layer
  1.1 Sensors Arduino API, getaway HTTP Sensor Hioki 
2. Transport Layer
  2.1 Getaway Raspberry Pi
  2.2 Auth CLIENT HTTP API
  2.3 MQTT CLIENT API
3. Processing Layer ( Cloud Service )
  3.1 MQTT Broker API ( Mosca )
  3.2 MQTT Over WebSocket Server ( Notification /socket.io)
  3.3 MQTT Broker Auth JWT API 
  3.4 Storage job queue Redis/Mongo ( kue/mongoose )
  3.5 RESTFul HTTP API/Mongo
  3.6 Auth JWT API ( Users and Devices )
4.  Aplication Layer
  4.1 React Native Android App

##### Features

+ Getaway Raspberry pi -> Serial communication Arduino / MQTT Client 
+ NodeJS RESTFul API (Express/ JWT/ PassportJS/ Connect-Roles/ Mongoose/ kue).
+ MQTT Broker (Moscajs/ ).
+ React Native Android App ( react-native-paho-mqtt over websocket ).
+ Authentication and Authorization JWT
+ Prototypes SketchApp.

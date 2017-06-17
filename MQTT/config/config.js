import mosca from 'mosca'

const configRedis = {
  type: 'redis',
  redis: require('redis'),
  db: 12,
  port: 6379,
  return_buffers: true, // to handle binary payloads
  host: "localhost"
};

export const moscaSettings = {
  port: 1883,
  backend: configRedis,
  persistence: {
    factory: mosca.persistence.Redis
  }
};

export const SECRET = {
  secret: "secret"
}

export const MONGO = {
  uri: "mongodb://localhost/apineo"
}

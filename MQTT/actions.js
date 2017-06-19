import { PERSIST } from './config/config'
import { createMeasurement, validateMsmCreate } from './queue/measurement'

export function actions(payload) {
  switch (payload.type) {
    case PERSIST:
      validateMsmCreate(payload.data)
        .then((value) => {
          createMeasurement(payload.data, (err) => {
            if (err) {
              console.log('Error createMeasurement ', err);
            }
          })
        })
        .catch((err) => {
          console.log('Error validate Measurement', err);
        })
      break;
    default:
      console.log('Sin Acciones');
  }
}

import kue from 'kue'
import { fetchKWh } from '../services/fetchKWh'
import { INDICATOR_KWH, INDICATOR_KWH_DELAY } from '../config/config'
import { createIndicator } from '../controllers/indicator'

const queue = kue.createQueue();
queue.watchStuckJobs(1000 * 10);

kue.app.set('title', 'Kue');

function delayValueKWh(delay, done) {
  queue.create('valueKWh')
    .attempts(5)
    .delay(delay)
    .save( err => {
      if (err) {
        console.error('Error create queue ' + err)
        done(err);
      }
      if (!err) {
        done();
      }
    });
}

queue.process('valueKWh', (job, done) => {
  fetchKWh()
  .then( ({value}) => {
    createIndicator(INDICATOR_KWH, value)
    done()
  })
  .catch((err) => {
    done(new Error(err.response))
  })

  delayValueKWh(INDICATOR_KWH_DELAY, err => {
    if(err)
      console.log(new Error(err));
  })
});

export const createFecthKWh = (done) => {
  queue.create('valueKWh')
    .attempts(5)
    .save( err => {
      if (err) {
        console.error('Error create queue ' + err)
        done(err);
      }
      if (!err) {
        done();
      }
    });
}

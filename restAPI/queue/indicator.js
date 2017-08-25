import kue from 'kue'
import { fetchKWh } from '../services/fetchKWh'
import { INDICATOR_KWH } from '../config/config'
import IndicatorController from '../controllers/indicator'

const queue = kue.createQueue();
const Indicator = new IndicatorController()

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
    Indicator.create(INDICATOR_KWH.id, INDICATOR_KWH.name, value)
    done()
  })
  .catch((err) => {
    done(new Error(err.response))
  })

  delayValueKWh(INDICATOR_KWH.delay, err => {
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

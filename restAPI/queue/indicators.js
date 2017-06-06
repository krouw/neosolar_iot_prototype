import kue from 'kue'
import { fetchKWh } from '../services/fetchKWh'

const queue = kue.createQueue();
queue.watchStuckJobs(1000 * 10);

kue.app.listen(7001);
kue.app.set('title', 'Kue');

function setValueKWh(done) {
  queue.create('valueKWh')
    .priority('critical')
    .attempts(8)
    .save(err => {
      if (err) {
        console.error(err);
        done(err);
      }
      if (!err) {
        done();
      }
    });
}

queue.process('valueKWh', function(done) {
  fetchKWh()
  .then((value) => {
    console.log(value);
  })
  .catch((err) => {
    console.log(err.response);
  })
});

export const createJob = (done) => {
  setValueKWh(done)
}

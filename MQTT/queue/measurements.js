import kue from 'kue'

const queue = kue.createQueue();
queue.watchStuckJobs(1000 * 10);

function addQeueMeasurement(data, done) {
  queue.create('addMeasurement')
    .attempts(3)
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

queue.process('addMeasurement', (job, done) => {

});

export const createMeasurement = (data, done) => {
  addQeueMeasurement()
}

import axios from 'axios'
import cheerio from 'cheerio'
import moment from 'moment'

//Data acquisition Hioki

const acquisition = () => {
	return new Promise((resolve, reject) => {
		  let msm = {
		    intensity: 1,
		    voltageTotal: 2,
				battery: {
					battery1: 1.1,
					battery2: 1.3,
					battery3: 1.3,
					battery4: 1.3
				},
				createAt: moment().format(),
		  }
		  resolve({
		    msm: msm
		  })
	});
}

export default acquisition;

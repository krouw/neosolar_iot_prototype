import axios from 'axios'
import cheerio from 'cheerio'
import moment from 'moment'

//Data acquisition Hioki

const acquisition = () => {
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

export default acquisition;

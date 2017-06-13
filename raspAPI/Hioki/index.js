import axios from 'axios'
import cheerio from 'cheerio'

//Data acquisition Hioki

const acquisition = () => {
	return new Promise((resolve, reject) => {
		axios.get('http://192.168.0.50/REALDATA.HTM?%3ACOMPORT%3AWEBORGUNIT=UNIT2%3B')
		.then( res => {
		  const $ = cheerio.load(res.data)
		  const table = $('BODY CENTER TABLE[cellspacing=0]').toArray()
		  const intensityDOM = table[0].children[6].children[4].children[0].children[0].data
			const battery1DOM = table[0].children[2].children[1].children[0].children[0].data
			const battery2DOM = table[0].children[2].children[4].children[0].children[0].data
			const battery3DOM = table[0].children[3].children[1].children[0].children[0].data
			const battery4DOM = table[0].children[3].children[4].children[0].children[0].data
			const voltageDOM = table[0].children[4].children[1].children[0].children[0].data
			let splitVT = voltageDOM.split('V')
			let splitB1 = battery1DOM.split('V')
			let splitB2 = battery2DOM.split('V')
			let splitB3 = battery3DOM.split('V')
			let splitB4 = battery4DOM.split('V')
			let splitI = intensityDOM.split('A')
		  let msm = {
		    intensity: 1,
		    voltageTotal: parseFloat(splitVT[0]),
				battery: {
					battery1: parseFloat(splitB1),
					battery2: parseFloat(splitB2),
					battery3: parseFloat(splitB3),
					battery4: parseFloat(splitB4)
				}
		  }
		  resolve({
		    msm: msm
		  })
		})
		.catch ( err => {
		  reject({
		    error: err,
		  })
		})
	});
}

export default acquisition;

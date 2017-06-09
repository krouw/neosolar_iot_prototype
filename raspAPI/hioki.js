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
			const voltageDOM = table[0].children[4].children[1].children[0].children[0].data
			let splitV = voltageDOM.split(' ')
			let splitI = intensityDOM.split('A')
			let intensity = splitI[0]*100;
			let voltage = splitV[2]
		  let msm = {
		    intensity: intensity.toString(),
		    voltage: voltage,
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

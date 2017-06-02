import axios from 'axios'
import cheerio from 'cheerio'

//Data acquisition Hioki

const acquisition = () => {
	return new Promise((resolve, reject) => {
			axios.get('http://192.168.0.50/REALDATA.HTM?%3ACOMPORT%3AWEBORGUNIT=UNIT2%3B')
			.then( res => {
				const $ = cheerio.load(res.data)
				const table = $('BODY CENTER TABLE[cellspacing=0]').toArray()
				const data = table[0].children[2].children[4].children[0].children[0].data
				let msm = {
					intensity: data,
					voltage: data,
				}
				resolve({
					data: msm
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

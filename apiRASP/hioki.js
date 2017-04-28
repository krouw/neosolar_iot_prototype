import axios from 'axios'
import cheerio from 'cheerio'


	setInterval(() => {
		axios.get('http://192.168.0.50/REALDATA.HTM')
		.then( res => {
			const $ = cheerio.load(res.data)
			const table = $('BODY CENTER TABLE[cellspacing=0]').toArray()
			const data = table[0].children[2].children[4].children[0].children[0].data
			console.log(data)
		})
		.catch ( err => {
			console.log(err)	
		})
	}, 2000)



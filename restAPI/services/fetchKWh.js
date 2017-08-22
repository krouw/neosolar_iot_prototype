import cheerio from 'cheerio'
import axios from 'axios'

export const fetchKWh = () => {
	return new Promise((resolve, reject) => {
		axios.get('https://www.eneldistribucion.cl/preguntas-frecuentes/valor-kwh')
		.then( res => {
		  const $ = cheerio.load(res.data)
		  const content = $('BODY > DIV').toArray()
      const data = content[0].children[4].children[3].children[1].children[0].data.split('$')
      const numbers = data[1].split(',')
			const measure = `${numbers[0]}.${numbers[1]}`
      resolve({
				value: parseFloat(measure)
			})
		})
		.catch ( err => {
		  reject({
		    error: err,
		  })
		})
	});
}

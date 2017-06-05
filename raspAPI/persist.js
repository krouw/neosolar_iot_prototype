import axios from 'axios'
import { id, password, api } from './config'

const persist = (body) => {

  axios.post(`${api}/device/${id}/measurement`, body)
	.then( res => {
    console.log(res.data.data);
	})
	.catch ( err => {
		console.log(err)
	})

}

export { persist }

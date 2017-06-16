import axios from 'axios'
import { ID, PASSWORD, SERVER } from './config/config'

const datastore = (body) => {

  if (!SERVER || !body) {
    return;
  }

  return axios.post(`${SERVER}/device/${ID}/measurement`, body)
	.then( res => {
    console.log("Guardado en el DataStore: ", res.data.data);
	})
	.catch ( err => {
		console.log('Error: ', err.response.data)
	})

}

export { datastore }

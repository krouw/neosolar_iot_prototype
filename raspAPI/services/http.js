import axios from 'axios'
import { ID, PASSWORD, SERVER } from '../config/config'

const persistHttp = (body) => {

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

const customPostRequestHttp = ( resource, body ) => {

  if (!resource || !body) {
    return;
  }

  return axios.post(resource, body)
          .catch((err) => {
            if(!err.response){
              return 'No se ha podido establecer conexión con el Servidor';
            }
            else if(err.response){
              if(err.response.status === 400 || err.response.status === 404 || err.response.status === 403){
                return err.response.data
              }
              else if(err.response.status === 500){
                return err.response.data.errors._error
              }
            }
          })

}

export { persistHttp, customPostRequestHttp }

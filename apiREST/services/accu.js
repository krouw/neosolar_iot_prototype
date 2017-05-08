var accuweather = require('node-accuweather')()('HeVASZ1RAZuAji6Loywzn6RzjdpRis5W');

export const getAccu = (req, res) => {
  accuweather.getCurrentConditions("Santiago")
    .then( result => {
      return res.status(200).json(result)
    })
    .catch( err => {
      return res.status(500).json({  message: 'No existe dispositivo. Lo sentimos, Hubo un problema en responder tu solicitud.' })
    })
}

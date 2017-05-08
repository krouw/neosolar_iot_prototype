import User from '../models/user'

export const validateRole = (req, res) => {
  console.log(req.user);
  User.findById({_id: req.user._id})
    .then( user => {
      return res.status(200).json(user.role)
    })
    .catch( err => {
      return res.status(500).json({ message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
    })
}

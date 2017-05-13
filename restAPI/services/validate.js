import User from '../models/user'
import auth from '../services/validate'

export const validateSecret = (req, res) => {
  User.findById({_id: req.user._id})
    .then( user => {
      console.log(user);
      if (user.role == "Client") {
        return res.status(200).json({ message: 'Rol identificado', Role: user.role, secret: secret.clientSecret })
      }
      else if (user.role == "Admin") {
        return res.status(200).json({ message: 'Rol identificado', Role: user.role, secret: secret.adminSecret })
      }
      else {
        return res.status(200).json({ message: 'Rol identificado', Role: user.role, secret: secret.managerSecret })
      }
    })
    .catch( err => {
      return res.status(500).json({ message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
    })
}

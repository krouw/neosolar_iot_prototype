import userRoute from '../routes/user';
import authRoute from '../routes/auth'
import deviceRoute from '../routes/device'

const routes = [{
      path: '/api/user',
      file: userRoute
    },
    {
      path: '/api/auth',
      file: authRoute
    },
    {
      path: '/api/device',
      file: deviceRoute,
    },
];

export default (app) => {
  routes.forEach((router) => app.use(router.path, router.file));
};

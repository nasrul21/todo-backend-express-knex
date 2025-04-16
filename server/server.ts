import app from './server-config';
import apiRoutes from './server-routes';

const port = process.env.PORT || 5000;

apiRoutes(app);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;

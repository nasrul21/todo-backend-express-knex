import app from './server-config';
import { routers } from './server-routes';
import swaggerUi from 'swagger-ui-express';
const swaggerOutput = require('./swagger_output.json');

const port = process.env.PORT || 5000;

app.use('/api', routers);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;

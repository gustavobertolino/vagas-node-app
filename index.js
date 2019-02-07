const server = require('./config/server');
const port = 3000;

server.listen(process.env.PORT || port, () => {console.log(`Server listening on port ${port}`)});
const userModel = require('../models/user');

databaseUsers = [];

module.exports = routes => {

    routes.get('/', (req, res) => {
        res.send('Recebido');
    });

    routes.get('/users/:id', (req, res) => {
        let user = databaseUsers.find(user => user.id == req.params.id);

        if (user) {
            res.send(user);
        } else {
            res.status(204).send('User not found');
        }
    });

    routes.get('/users', (req, res) => {
        res.send(databaseUsers);
    });

    routes.post('/users', (req, res) => {
        try {

            let user = new userModel.User(
                req.body.id,
                req.body.name,
                req.body.email,
                req.body.password);

            databaseUsers.push(user);
            res.send(user);

        } catch (error) {
            res.status(500).send(error);
        }
    });

    routes.put('/users/:id', (req, res) => {
        databaseUsers.forEach(user => {

            if (user.id == req.params.id) {
                try {
                    user.name = req.body.name;
                    user.email = req.body.email;
                    user.password = req.body.password;

                    res.send(user);
                } catch (error) {
                    return res.status(500).send("Invalid Parameters");
                }
            }

        });
    });

    routes.delete('/users/:id', (req, res) => {
        let userExist = false;

        databaseUsers.forEach((user, index) => {
            if (user.id == req.params.id) {
                userExist = true;
                databaseUsers.splice(index, 1);

                res.send(user);
            }

            if (!userExist) {
                res.status(404).send('Id not found');
            }
        });
    });
};
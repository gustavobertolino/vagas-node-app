const jwt = require('jsonwebtoken');

module.exports = routes => {

    const database = routes.config.firebaseConfig.collection('users');

    routes.post('/login', async (req, res) => {
        try {
            let data = await database.get();
            let filteredUser = data.docs.find(doc => {
                let user = doc.data();

                return user.email == req.body.email && user.password == req.body.password;
            });

            if (filteredUser) {
                filteredUser = extractUser(filteredUser);
                let id = filteredUser.id;
                let token = jwt.sign({
                    id
                }, req.body.password);
                res.send({
                    auth: true,
                    token: token
                });

            } else {
                return res.status(404).send({auth: false, message: 'User not found'});
            }

        } catch (error) {
            return res.status(500).send(error);
        }

    });

    extractUser = user => {
        let info = user.data();

        if (!info) {
            return false;
        }

        return {
            id: user.id,
            name: info.name,
            email: info.email,
            password: info.password
        }
    }
}
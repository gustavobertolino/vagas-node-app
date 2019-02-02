const validateToken = require('../../config/security/tokenValidator');

module.exports = routes => {

    const dbFirebase = routes.config.firebaseConfig.collection('users');

    routes.get('/users', /*validateToken,*/ async (req, res) => {
        try {
            const docs = await dbFirebase.get();
            let userNames = [];

            docs.forEach(element => {
                userNames.push(extractUser(element));
            });

            return res.send(userNames);

        } catch (error) {
            return res.status(500).send(error);
        }
    });

    routes.get('/users/:id', /*validateToken,*/ async (req, res) => {
        try {
            let user = await dbFirebase.doc(req.params.id).get();

            if (user.exists) {
                return res.send(extractUser(user));
            } else {
                return res.status(404).send('user not found');
            }
        } catch (error) {
            return res.status(500).send(error);
        }
    });

    routes.post('/users', async (req, res) => {
        try {

            let user = await dbFirebase.doc().set(req.body);
            return res.send(user);

        } catch (error) {
            res.status(500).send(error);
        }
    });

    routes.put('/users/:id', async (req, res) => {
        try {
            let user = await dbFirebase.doc(req.params.id).update(req.body);

            if (user) {
                return res.send(`a vaga ${req.body.name} foi atualizada`);
            } else {
                return res.status(404).send('user not found');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    });

    routes.delete('/users/:id', async (req, res) => {
        try {
            await dbFirebase.doc(req.params.id).delete();

            return res.send(`a vaga ${req.params.id} foi deletada`);
        } catch (error) {
            return res.status(404).send('user not found');
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
            salary: info.salary,
            description: info.description,
            skills: info.skills,
            area: info.area,
            differentials: info.differentials,
            isPcd: info.isPcd,
            isActive: info.isActive
        };
    };
};
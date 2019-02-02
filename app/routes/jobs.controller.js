const validateToken = require('../../config/security/tokenValidator');

module.exports = routes => {

    const dbFirebase = routes.config.firebaseConfig.collection('jobs');

    routes.get('/jobs', /*validateToken*/ async (req, res) => {
        try {
            const docs = await dbFirebase.get();
            let jobNames = [];

            docs.forEach(element => {
                jobNames.push(extractJob(element));
            });

            return res.send(jobNames);

        } catch (error) {
            return res.status(500).send(error);
        }
    });

    routes.get('/jobs/:id', /*validateToken*/ async (req, res) => {
        try {
            let job = await dbFirebase.doc(req.params.id).get();

            if (job.exists) {
                return res.send(extractJob(job));
            } else {
                return res.status(404).send('Job not found');
            }
        } catch (error) {
            return res.status(500).send(error);
        }
    });

    routes.post('/jobs', async (req, res) => {
        try {

            let job = await dbFirebase.doc().set(req.body);
            return res.send(job);

        } catch (error) {
            res.status(500).send(error);
        }
    });

    routes.put('/jobs/:id', async (req, res) => {
        try {
            let job = await dbFirebase.doc(req.params.id).update(req.body);

            if (job) {
                return res.send(`a vaga ${req.body.name} foi atualizada`);
            } else {
                return res.status(404).send('Job not found');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    });

    routes.delete('/jobs/:id', async (req, res) => {
        try {
            await dbFirebase.doc(req.params.id).delete();

            return res.send(`a vaga ${req.params.id} foi deletada`);
        } catch (error) {
            return res.status(404).send('Job not found');
        }
    });

    extractJob = job => {
        let info = job.data();

        if (!info) {
            return false;
        }

        return {
            id: job.id,
            name: info.name,
            salary: info.salary,
            description: info.description,
            skills: info.skills,
            area: info.area,
            differentials: info.differentials,
            isPcd: info.isPcd,
            isActive: info.isActive
        }
    }
};
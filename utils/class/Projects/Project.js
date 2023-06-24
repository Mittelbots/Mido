const MidoProjects = require('../../../bot/db/Models/mido_projects.model');

class Project {
    constructor() {}

    get(guild_id) {
        return new Promise(async (resolve, reject) => {
            MidoProjects.findAll({
                where: {
                    guild_id: guild_id,
                },
            })
                .then((projects) => {
                    return resolve(projects);
                })
                .catch(() => {
                    return reject([]);
                });
        });
    }
}

module.exports = Project;

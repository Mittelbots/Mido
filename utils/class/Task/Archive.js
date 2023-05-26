const Task = require('./Task');

class Archive extends Task {
    constructor() {}

    init() {}

    getGuild(guild_id) {
        const archive = this.get({
            guild_id: guild_id,
            state: this.state_Deleted,
        });

        return Promise.resolve(archive) || Promise.reject();
    }

    getUser(guild_id, user_id) {
        const archive = this.get({
            guild_id: guild_id,
            user_id: user_id,
            state: this.state_Deleted,
        });

        return Promise.resolve(archive) || Promise.reject();
    }

    get(whereQuery) {
        return new Promise(async (resolve, reject) => {
            MidoTodo.findAll({
                where: whereQuery,
            })
                .then((tasks) => {
                    return resolve(tasks);
                })
                .catch(() => {
                    return reject();
                });
        });
    }
}

module.exports = Archive;

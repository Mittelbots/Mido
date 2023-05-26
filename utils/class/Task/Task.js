class Task {
    state_Active = 1;
    state_Inactive = 0;
    state_Deleted = 2;
    state_Ready = 3;

    constructor() {}

    init() {}

    get({ guild_id, user_id = null, state = this.state_Active }) {
        return new Promise(async (resolve, reject) => {
            MidoTodo.findAll({
                where: {
                    guild_id: guild_id,
                    state: state,
                    ...(user_id ? { user_id: user_id } : {}),
                },
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

module.exports = Task;

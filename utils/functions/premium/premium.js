const config = require('../../assets/json/_config/config.json');
const database = require('../../../bot/db/db');
const { errorhandler } = require('../errorhandler/errorhandler');

module.exports.isUserPremium = async ({ user_id }) => {
    return await database
        .query(`SELECT premium, platin FROM ${config.tables.mido_premium} WHERE user_id = ?`, [
            user_id,
        ])
        .then((res) => {
            if (res.length === 0) return false;

            return {
                error: false,
                premium: res[0].premium ? true : false,
                platin: res[0].platin ? true : false,
            };
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return {
                error: true,
                message: 'Error while fetching user premium status',
            };
        });
};

module.exports.addUserPremium = async ({ user_id, premium, platin }) => {
    premium = premium ? 1 : 0;
    platin = platin ? 1 : 0;

    const isUserPremium = await this.isUserPremium({
        user_id,
    });

    if (isUserPremium) {
        if (isUserPremium.error) {
            return isUserPremium;
        }
        if (
            (isUserPremium.premium && !premium) ||
            (isUserPremium.platin && !platin) ||
            (!isUserPremium.platin && platin) ||
            (!isUserPremium.premium && premium)
        ) {
            return await this.updateUserPremium({
                user_id,
                premium,
                platin,
            });
        }
    }

    return await database
        .query(
            `INSERT INTO ${config.tables.mido_premium} (user_id, premium, platin) VALUES (?, ?, ?)`,
            [user_id, premium, platin]
        )
        .then(() => {
            errorhandler({
                err: '',
                message: `User premium status added UserId: ${user_id}`,
                fatal: false,
            });
            return {
                error: false,
                message: 'User premium status added',
            };
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return {
                error: true,
                message: 'Error while adding user premium status',
            };
        });
};

module.exports.updateUserPremium = async ({ user_id, premium, platin }) => {
    premium = premium ? 1 : 0;
    platin = platin ? 1 : 0;

    if (!premium && !platin) {
        return await this.removeUserPremium({
            user_id,
        });
    }

    return await database
        .query(
            `UPDATE ${config.tables.mido_premium} SET premium = ?, platin = ? WHERE user_id = ?`,
            [premium, platin, user_id]
        )
        .then(async () => {
            errorhandler({
                err: '',
                message: `User premium status added UserId: ${user_id}`,
                fatal: false,
            });
            return {
                error: false,
                message: 'User premium status updated',
            };
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return {
                error: true,
                message: 'Error while updating user premium status',
            };
        });
};

module.exports.removeUserPremium = async ({ user_id }) => {
    return await database
        .query(`DELETE FROM ${config.tables.mido_premium} WHERE user_id = ?`, [user_id])
        .then((res) => {
            errorhandler({
                err: '',
                message: `User premium status removed UserId: ${user_id}`,
                fatal: false,
            });
            return {
                error: false,
                message: 'User premium status removed',
            };
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return {
                error: true,
                message: 'Error while removing user premium status',
            };
        });
};

module.exports.getAllPremium = async () => {
    return await database
        .query(`SELECT * FROM ${config.tables.mido_premium}`)
        .then((res) => {
            if (res.length === 0) return false;
            return res;
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return false;
        });
};

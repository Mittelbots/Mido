require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { errorhandler } = require('../../utils/functions/errorhandler/errorhandler');
const SequelizeModel = require('sequelize/lib/model');

const database = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: (...msg) => {
        if (msg[1].showWarnings) {
            errorhandler({
                message: msg,
                fatal: true,
            });
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    retry: {
        max: 3,
    },
    define: {
        freezeTableName: true,
        timestamps: false,
    },
});

const orgFindAll = SequelizeModel.findAll;
SequelizeModel.findAll = function () {
    return orgFindAll.apply(this, arguments).catch((err) => {
        errorhandler({ err });
        throw err;
    });
};
const orgFindOne = SequelizeModel.findOne;
SequelizeModel.findOne = function () {
    return orgFindOne.apply(this, arguments).catch((err) => {
        errorhandler({ err });
        throw err;
    });
};
const orgFindOrCreate = SequelizeModel.findOrCreate;
SequelizeModel.findOrCreate = function () {
    return orgFindOrCreate.apply(this, arguments).catch((err) => {
        errorhandler({ err });
        throw err;
    });
};
const orgCreate = SequelizeModel.create;
SequelizeModel.create = function () {
    return orgCreate.apply(this, arguments).catch((err) => {
        errorhandler({ err });
        throw err;
    });
};
const orgUpdate = SequelizeModel.update;
SequelizeModel.update = function () {
    return orgUpdate.apply(this, arguments).catch((err) => {
        errorhandler({ err });
        throw err;
    });
};
const orgDestroy = SequelizeModel.destroy;
SequelizeModel.destroy = function () {
    return orgDestroy.apply(this, arguments).catch((err) => {
        errorhandler({ err });
        throw err;
    });
};

database.init = () => {
    return new Promise(async (resolve, reject) => {
        const dir = path.resolve('bot/db/Models/');
        console.log('Loading models...');
        await database
            .authenticate()
            .then(() => {
                fs.readdirSync(dir).forEach((file) => {
                    console.log('Loading model: ' + file);
                    require(path.join(dir, file));
                });
            })
            .catch((err) => {
                reject(err);
                errorhandler({
                    message: 'There was an error when creating models: ' + err.toString(),
                    fatal: true,
                });
            });
        await database.sync({
            alter: true,
        });

        const data_mg_path = path.resolve('bot/db/data_migration/');
        fs.readdirSync(data_mg_path).forEach((file) => {
            if (!file.includes('.default')) return;
            console.log('Loading data migration: ' + file);
            require(path.join(data_mg_path, file));
        });
        resolve(true);
    });
};

database.afterSync((connection) => {
    console.log(`Successfully synced ${connection.name.plural}.`);
});

database.afterDestroy((error) => {
    errorhandler({
        message: 'Database connection error! ' + error.toString(),
        fatal: true,
    });
});

module.exports = database;

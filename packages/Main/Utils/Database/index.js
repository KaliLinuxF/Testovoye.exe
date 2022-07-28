const { Sequelize, Op, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize('testovoye', 'root', '2612', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('[База данных]: Успешное подключение');
      } catch (error) {
        console.error('[База данных]: ошибка подключения, ', error);
      }
}

testConnection();

//const Account = require('./Modules/accounts').Account(sequelize, DataTypes, Model, Op);

// module.exports.Account = Account;

async function syncModels() {
	await sequelize.sync({ alter: true, force: false }).then(() => {
		console.log('Все модели синхронизированны.')
	}).catch((error) => {
		console.log('Ошибка в синхронизации моделей: ', error);
	})
}

syncModels();
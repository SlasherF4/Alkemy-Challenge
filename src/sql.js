const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('apidb', 'postgres', 'master', {
    host: 'localhost',
    dialect: 'postgres'
});

const User = sequelize.define('user', {
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

const Character = sequelize.define('character', {
    character_image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    character_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    character_age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    character_weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    character_story: {
        type: DataTypes.STRING,
        allowNull: false
    },
    character_movies: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Media = sequelize.define('media', {
    media_image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    media_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    media_creation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    media_rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    media_related: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Genre = sequelize.define('genre', {
    genreName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genreImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genreRelatedMedia: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

async function synchronize() {
    await sequelize.sync();
    console.log('All models were synchronized successfully.')
};

async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection with DataBase has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports.synchronize = synchronize;
module.exports.Character = Character;
module.exports.Media = Media;
module.exports.Genre = Genre;
module.exports.test = test;
const index = require('./index');
const sql = require('./sql');

async function searchMovies(res, param, value) {
    console.log(value)
    if(value === undefined) {
        return false
    }
    const search = await sql.Media.findAll({
        where: {
            ['media_' + param]: [value]
        }
    });
    if(search.length === 0) {
        res.status(404).send('no se encontraron resultados');
    }else {
        return search 
    }
}

async function mediaList(res, queryParams) {
    const search = await searchMovies(res, Object.keys(queryParams)[0], Object.values(queryParams)[0])
    if(search === false) {
        const list = await sql.Media.findAll({
            attributes: ['media_image', 'media_title', 'media_creation']
        });
        res.send(list);
    }else {
        res.send(search);
    }
}

module.exports.mediaList = mediaList
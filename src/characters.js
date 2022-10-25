const index = require('./index');
const sql = require('./sql');

async function searchCharacter(res, param, value) {
    console.log(value)
    if(value === undefined) {
        return false
    }
    const search = await sql.Character.findAll({
        where: {
            ['character_' + param]: [value]
        }
    });
    if(search.length === 0) {
        res.status(404).send('no se encontraron resultados');
    }else {
        return search 
    }
}

async function characterList(res, queryParams) {
    const search = await searchCharacter(res, Object.keys(queryParams)[0], Object.values(queryParams)[0]);
    if(search === false) {
        const list = await sql.Character.findAll({
            attributes: ['character_image', 'character_name']
        });
        res.send(list);
    } else{
        res.send(search);
    }
}

module.exports.characterList = characterList;
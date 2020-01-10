import https from 'https'
import path from 'path'

exports.home = function home(req, res) {
    res.sendFile(path.join(__dirname + '/../index.html'));
};

exports.pokemon = function (req, res) {
    res.sendFile(path.join(__dirname + '/../index.html'));
};

exports.pokemons = function (req, res) {
    return new Promise((resolve, reject) => {

        let size = req.param('size');

        const options = {
            hostname: 'api.pokemontcg.io',
            port: 443,
            path: `/v1/cards?count=${size}`,
            method: 'GET'
        };

        let reqClient = https.request(options, resClient => {

            let dataClient = '';

            resClient
                .on('data', (chunk) => dataClient += chunk.toString())
                .on('end', () => resolve(dataClient));

        }).on('error', (err) => {
            console.log(err);
        });

        reqClient.end();
    })
        .then((data) => res.json(JSON.parse(data)));
};

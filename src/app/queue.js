const Spotify = require('./helpers/spotify');
let Queue = {};

Queue.add = (spotify_id) => {
    return new Promise((resolve, reject) => {
        if (!Spotify.isValidID(spotify_id)) {
            throw new Error('Spotify id "'+spotify_id+'" is not valid');
        }

        resolve();
    });
}

module.exports = Queue;
let Spotify = {};

Spotify.isValidID = (id) => {
    return id.match(/[\d\w]{22}/);
};

module.exports = Spotify;

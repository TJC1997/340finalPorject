-- Delete current tables
DROP TABLE IF EXISTS songs_singers;
DROP TABLE IF EXISTS singers_albums;
DROP TABLE IF EXISTS singers;
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS albums;
-- Create tables
CREATE TABLE albums(
    albumID int(11) AUTO_INCREMENT NOT NULL,
    albumName varchar(255) NOT NULL,
    albumReleaseDate DATE,
    PRIMARY KEY (albumID)
);
CREATE TABLE genres(
    genreID int(11) AUTO_INCREMENT NOT NULL,
    genreName varchar(255) NOT NULL,
    PRIMARY KEY (genreID)
);
CREATE TABLE songs(
    songID int(11) AUTO_INCREMENT NOT NULL,
    songName varchar(255) NOT NULL,
    album int(11),
    genre int(11),
    PRIMARY KEY (songID),
    FOREIGN KEY (album) REFERENCES albums(albumID),
    FOREIGN KEY (genre) REFERENCES genres(genreID)
);
CREATE TABLE singers(
    singerID int(11) AUTO_INCREMENT NOT NULL,
    singerName varchar(255) NOT NULL,
    homeCity varchar(255),
    homeState varchar(255),
    PRIMARY KEY (singerID)
);
CREATE TABLE singers_albums(
    singerID int(11),
    albumID int(11),
    PRIMARY KEY (singerID, albumID),
    FOREIGN KEY (singerID) REFERENCES singers(singerID),
    FOREIGN KEY (albumID) REFERENCES albums(albumID)
);
CREATE TABLE songs_singers(
    songID int(11),
    singerID int(11),
    PRIMARY KEY (songID, singerID),
    FOREIGN KEY (songID) REFERENCES songs(songID),
    FOREIGN KEY (singerID) REFERENCES singers(singerID)
);
-- Insert Data
INSERT INTO albums(albumName, albumReleaseDate)
VALUES (
        "My Beautiful Dark Twisted Fantasy",
        "2010-11-22"
    ),
    ("American Idiot", "2004-09-21"),
    ("In The Zone", "2003-11-18"),
    ("NULL", "NULL");
INSERT INTO genres(genreName)
VALUES ("Rock"),
    ("Rap"),
    ("Pop"),
    ("NULL");
INSERT INTO songs(songName, album, genre)
VALUES (
        "Gorgeous",
        (
            SELECT albumID
            from albums
            where albumName = "My Beautiful Dark Twisted Fantasy"
        ),
        (
            SELECT genreID
            FROM genres
            WHERE genreName = "Rap"
        )
    ),
    (
        "American Idiot",
        (
            SELECT albumID
            from albums
            where albumName = "American Idiot"
        ),
        (
            SELECT genreID
            FROM genres
            WHERE genreName = "Rock"
        )
    ),
    (
        "Toxic",
        (
            SELECT albumID
            from albums
            where albumName = "In The Zone"
        ),
        (
            SELECT genreID
            FROM genres
            WHERE genreName = "Pop"
        )
    ),
    (
        "NULL",
        (
            SELECT albumID
            from albums
            where albumName = "NULL"
        ),
        (
            SELECT genreID
            FROM genres
            WHERE genreName = "NULL"
        )
    );
INSERT INTO singers(singerName, homeCity, homeState)
VALUES ("Kanye West", "Atlanta", "GA"),
    ("Britney Spears", "McComb", "MS"),
    ("Green Day", "Berkeley", "CA"),
    ("NULL", "NULL", "NULL");
INSERT INTO singers_albums(singerID, albumID)
VALUES (
        (
            SELECT singerID
            FROM singers
            WHERE singerName = "Green Day"
        ),
        (
            SELECT albumID
            FROM albums
            WHERE albumName = "American Idiot"
        )
    ),
    (
        (
            SELECT singerID
            FROM singers
            WHERE singerName = "Kanye West"
        ),
        (
            SELECT albumID
            FROM albums
            WHERE albumName = "My Beautiful Dark Twisted Fantasy"
        )
    ),
    (
        (
            SELECT singerID
            FROM singers
            WHERE singerName = "Britney Spears"
        ),
        (
            SELECT albumID
            FROM albums
            WHERE albumName = "In The Zone"
        )
    );
INSERT INTO songs_singers(songID, singerID)
VALUES (
        (
            SELECT songID
            FROM songs
            WHERE songName = "American Idiot"
        ),
        (
            SELECT singerID
            FROM singers
            WHERE singerName = "Green Day"
        )
    ),
    (
        (
            SELECT songID
            FROM songs
            WHERE songName = "Gorgeous"
        ),
        (
            SELECT singerID
            FROM singers
            WHERE singerName = "Kanye West"
        )
    ),
    (
        (
            SELECT songID
            FROM songs
            WHERE songName = "Toxic"
        ),
        (
            SELECT singerID
            FROM singers
            WHERE singerName = "Britney Spears"
        )
    );
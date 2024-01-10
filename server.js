/**
 * Exempel på Express + EJS
 * Av Mattias Dahlgren
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');                      // Sätt EJS som view engine
app.use(express.static('public'));                  // Sätt sökväg till statiska filer
app.use(bodyParser.urlencoded({ extended: true })); // Läs av POST-data
const db = new sqlite3.Database('./db/users.db');   // Anslut till databasen


app.get('/', (req, res) => {
    // Kontrollera om felkod finns i URL
    let error = req.query.error;
    if (error == 1) {
        error = 'Alla fält måste vara ifyllda';
    } else {
        error = null;
    }

    // Hämta alla användare från databasen
    db.all('SELECT * FROM users ORDER BY id DESC', (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Database error');
        }

        // Rendera vyn index.ejs och skicka med användarna
        res.render('index', { users: rows, error: error });
    });
});

app.post('/add', (req, res) => {
    let name = req.body.name;
    let age = req.body.age;

    // Validera
    if (!name || !age) {
        // Returnera till index med felmeddelande
        return res.redirect('/?error=1');
    }

    // Lägg till användare i databasen
    db.run('INSERT INTO users(name, age) VALUES (?, ?)', [name, age], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Database error');
        }

        // Returnera till index
        res.redirect('/');
    });
});

app.get('/edit/:id', (req, res) => {
    let id = req.params.id;

    // Kontrollera om felkod finns i URL
    let error = req.query.error;
    if (error == 1) {
        error = 'Alla fält måste vara ifyllda';
    } else {
        error = null;
    }

    // Hämta användare från databasen
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Database error');
        }

        // Rendera vyn edit.ejs och skicka med användaren
        res.render('edit', { user: row, error: error });
    });
});

app.post('/edit/:id', (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let age = req.body.age;

    // Validera
    if (!name || !age) {
        // Returnera till index med felmeddelande
        return res.redirect('/edit/' + id + '?error=1');
    }

    // Uppdatera användare i databasen
    db.run('UPDATE users SET name = ?, age = ? WHERE id = ?', [name, age, id], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Database error');
        }

        // Returnera till index
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    let id = req.params.id;

    // Ta bort användare från databasen
    db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Database error');
        }

        // Returnera till index
        res.redirect('/');
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});

app.listen(port, () => console.log(`Servern är igång på port ${port}!`));
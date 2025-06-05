require('dotenv').config();
const express = require('express');
const cors = require('cors');
var mysql = require('mysql');
var moment = require('moment');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var connection = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DBHOST,
    user            : process.env.DBUSER,
    password        : process.env.DBPASS,
    database        : process.env.DBNAME
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
  });

// Összes növény lekérdezése
app.get('/api/plants', (req, res) => {
    connection.query('SELECT * FROM plants', (error, results) => {
        if (error) {
            console.error('Error fetching plants:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

// Növény lekérdezése ID alapján
app.get('/api/plants/:id', (req, res) => {
    const plantId = req.params.id; 
    connection.query('SELECT * FROM plants WHERE id = ?', [plantId], (error, results) => {
        if (error) {
            console.error('Error fetching plant:', error);
            res.status(500).send({ error: 'Failed to fetch plant' }); 
        } else if (results.length === 0) {
            res.status(404).send({ error: 'Plant not found' }); 
        } else {
            res.json(results[0]);
        }
    });
});
// Új növény hozzáadása
app.post('/api/plants', (req, res) => {
    const { name, species, water_interval_days } = req.body;
    const query = 'INSERT INTO plants (name, species, water_interval_days) VALUES (?, ?, ?)';
    connection.query(query, [name, species, water_interval_days], (error, results) => {
        if (error) {
            console.error('Error adding plant:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(201).json({ id: results.insertId });
        }
    });
});
//Növény módosítása
app.patch('/api/plants/:id', (req, res) => {
    const plantId = req.params.id;
    const { name, species, water_interval_days } = req.body;

    const query = 'UPDATE plants SET name = ?, species = ?, water_interval_days = ? WHERE id = ?';

    connection.query(query, [name, species, water_interval_days, plantId], (error, results) => {
        if (error) {
            console.error('Error updating plant:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Plant not found' });
        } else {
            res.status(200).json({ message: 'Plant updated successfully' });
        }
    });
});
// Növény törélse
app.delete('/api/plants/:id', (req, res) => {
    const plantId = req.params.id;
    connection.query('DELETE FROM plants WHERE id = ?', [plantId], (error, results) => {
        if (error) {
            console.error('Error deleting plant:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Plant not found' });
        } else {
            res.status(204).send();
        }
    });
});

//Statisztika lekérdezése
app.get('/api/stats', (req, res) => {
    connection.query('SELECT * FROM statistics', (error, results) => { 
        if (error) {
            console.error('Error fetching statistics:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

//Egy növény öntözésie
app.get('/api/plants/:id/waterings', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM watering_logs WHERE plant_id = ?', [id], (error, results) => {
        if (error) {
            console.error('Error fetching waterings:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

//Új öntözés felvétele
app.post('/api/waterings', (req, res) => {
    const { plant_id, amount_ml, date_watered, notes } = req.body;
    const query = 'INSERT INTO watering_logs (plant_id, amount_ml, date_watered, notes) VALUES (?, ?, ?, ?)';
    connection.query(query, [plant_id, amount_ml, date_watered, notes], (error, results) => {
        if (error) {
            console.error('Error adding watering record:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(201).json({ id: results.insertId });
        }
    });
});

//Öntözés törlése
app.delete('/api/waterings/:id', (req, res) => {
    const wateringId = req.params.id;
    connection.query('DELETE FROM watering_logs WHERE id = ?', [wateringId], (error, results) => {
        if (error) {
            console.error('Error deleting waterings record:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Waterings record not found' });
        } else {
            res.status(204).send();
        }
    });
});
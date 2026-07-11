const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.render('index', { title: 'Home', services });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.render('services/list', { title: 'Our Services', services });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

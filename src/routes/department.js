const express = require('express');
const { getAvailableDepartment, getCitiesFromDepartment, getCityCharges, getDepartmentCharges} = require('../controllers/department');

const router = express.Router();

router.get('/', getAvailableDepartment);
router.get('/:dptCode', getCitiesFromDepartment);
router.get('/:dptCode/city/:postalCode/charges', getCityCharges);
router.get('/:dptCode/charges', getDepartmentCharges);

module.exports = router;
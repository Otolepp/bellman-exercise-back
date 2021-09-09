const { dao } = require("../database/database");
const Joi = require('joi');
const { getCondoSizeValue, calculateCharges } = require("../utils/utils");

const getAvailableDepartment = async (req, res) => {
    const sql = "SELECT DISTINCT dpt_code AS dptCode FROM City ORDER BY dpt_code";
    try {
        const rows = await dao.all(sql, []);
        res.status(200).json({ 'Available department' : rows });
    } catch (err) {
        res.status(400).json({ err });
    }
};

const getCitiesFromDepartment = async (req, res) => {
    const sql = "SELECT name AS city, postal_code AS postalCode FROM City WHERE dpt_code = ?";
    const params = [req.params.dptCode];
    try {
        const rows = await dao.all(sql, params);
        if(rows.length == 0) {
            return res.status(404).json({'invalid data' : `dptCode ${params[0]} does not exist`});
        }
        res.status(200).json({ 'cities' : rows });
    } catch (err) {
        res.status(400).json({ err });
    }
};

const getCityCharges = async (req, res) => {
    const { error } = validateQuery(req.query);
    if(error) {
        return res.status(400).json({"data validation error" : error.details[0].message});
    }

    var sql = "SELECT * FROM BaseStats WHERE cityID IN (SELECT id FROM City WHERE dpt_code = ? AND postal_code = ?) AND condo_size = ? ";
    const params = [req.params.dptCode, req.params.postalCode, getCondoSizeValue(req.query.condoSize)];

    try {
        const stats = await dao.all(sql, params);
        if(stats.length == 0) {
            return res.status(404).json({'no data found' : `no buildings correspond to your parameters}`});
        }
        
        var sum = 0, min = Infinity, max = 0;
        
        for (let index = 0; index < stats.length; index++) {
            const {charges, min_charges, max_charges} = calculateCharges(stats[index], req.query);

            if(min_charges < min){
                min = min_charges;
            }
            if(max_charges > max){
                max = max_charges;
            }
            sum += charges; 
        }

        const mean = sum / stats.length;
        
        res.status(200).json({ 'mean' : mean, 'min' : min, 'max' : max});

    } catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
};



const getDepartmentCharges = async (req, res) => {
    const { error } = validateQuery(req.query);
    if(error) {
        return res.status(400).json({"data validation error" : error.details[0].message});
    }

    var sql = "SELECT * FROM BaseStats WHERE cityID IN (SELECT id FROM City WHERE dpt_code = ?) AND condo_size = ? ";
    const params = [req.params.dptCode, getCondoSizeValue(req.query.condoSize)];

    try {

        const stats = await dao.all(sql, params);
        if(stats.length == 0) {
            return res.status(404).json({'no data found' : `no buildings correspond to your parameters}`});
        }

        var sum = 0, min = Infinity, max = 0;
        
        for (let index = 0; index < stats.length; index++) {
            const {charges, min_charges, max_charges} = calculateCharges(stats[index], req.query);

            if(min_charges < min){
                min = min_charges;
            }
            if(max_charges > max){
                max = max_charges;
            }
            sum += charges; 
        }

        const mean = sum / stats.length;
        
        res.status(200).json({ 'mean' : mean, 'min' : min, 'max' : max});

    } catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
};




function validateQuery(query){
    const schema = Joi.object().keys({
        condoSize: Joi.number().required(), 
        heating: Joi.boolean().required(),
        employee: Joi.boolean().required(), 
        elevator: Joi.boolean().required()
    });
    return schema.validate(query);
}



module.exports = {getAvailableDepartment, getCitiesFromDepartment, getCityCharges, getDepartmentCharges};
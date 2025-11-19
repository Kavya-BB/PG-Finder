const Pg = require('../models/pg-model.js');
const { pgValidationSchema } = require('../validations/pg-validation.js');
const User = require('../models/user-model.js');
const { boolean } = require('joi');
const pgCltr = {};

pgCltr.createPg = async (req, res) => {
    const body = req.body;
    const { error, value } = pgValidationSchema.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details.map(ele => ele.message) });
    }
    try {
        const user = await User.findById(req.userId);
        if(!user) {
            return res.status(404).json({ error: 'User not found!!!' });
        }
         if(user.role !== 'owner') {
            return res.status(403).json({ error: 'only owners can create PG Listing!!!' });
        }
        const existingPg = await Pg.findOne({
            ownerId: req.userId,
            'location.address': value.location.address,
            pgname: value.pgname
        });
        if(existingPg) {
            return res.status(403).json({ error: 'PG with a same name and address already exists!!!' });
        }
        const pgPhotos = Array.isArray(req.files?.pgPhotos) ? req.files.pgPhotos.map(file => file.path) : [];
        const pgCertificate = req.files?.pgCertificate?.[0]?.path || null;
        const pg = new Pg({ 
            ...value, 
            ownerId: req.userId, 
            pgPhotos, 
            pgCertificate 
        });
        await pg.save();
        res.status(201).json(pg);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong while creating PG!!!' });
    }
};

pgCltr.getAllPgs = async (req, res) => {
    try {
        const pgs = await Pg.find();
        res.json(pgs);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong!!!' });
    }
};

pgCltr.getPgById = async (req, res) => {
    const id = req.params.id;
    try {
        const pg = await Pg.findById(id);
        if(!pg) {
            res.status(404).json({ error: 'Pg not found' });
        }
        res.json(pg);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong!!!' });
    }
};

pgCltr.updatePg = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error, value } = pgValidationSchema.validate(body, { abortEarly: false });
        if(error) {
            res.status(400).json({ error: error.details.map(ele => ele.message) });
        }
        const pg = await Pg.findByIdAndUpdate(id, value, { new: true });
        if(!pg) {
            res.status(404).json({ error: 'Pg not found' });
        }
        res.json(pg);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong!!!' });
    }
};

pgCltr.deletePg = async (req, res) => {
    const id = req.params.id;
    try{
        const pg = await Pg.findByIdAndDelete(id);
        if(!pg) {
            res.status(404).json({ error: 'Pg not found' });
        }
        res.json(pg);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong!!!' });
    }
}

pgCltr.verifyC = async (req, res) => {
    const pgId = req.params.id;
    const { isVerified } = req.body;
    try {
        const pg = await Pg.findById(pgId);
        if(!pg) {
            res.status(404).json({ error: 'Pg not found' });
        }
        pg.isVerified = isVerified;
        await pg.save();
        res.json({ message: isVerified ? "Certificate verified successfully" : "Certificate verification removed", 
            isVerified: pg.isVerified
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong!!!' });
    }
}

pgCltr.approvePg = async (req, res) => {
    const pgid = req.params.id;
    const { isApproved } = req.body;
    try {
        const pg = await Pg.findById(pgid);
        if(!pg) {
            res.status(404).json({ error: 'something went wrong!!!' });
        }
        if(isApproved == true && pg.isVerified == false) {
            res.status(400).json({ error: "Cannot approve PG because certificate is not verified" });
        }
        pg.isApproved = isApproved;
        if(isApproved == true) {
            pg.isVerified = true;
        }
        await pg.save();
        res.json({ message: pg.isApproved ? "Pg approved successfully" : "Pg approval removed", 
            isApproved: pg.isApproved, 
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong!!!' });
    }
}

module.exports = pgCltr;
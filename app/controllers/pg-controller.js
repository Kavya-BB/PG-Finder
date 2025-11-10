const Pg = require('../models/pg-model.js');
const { pgValidationSchema } = require('../validations/pg-validation.js');
const User = require('../models/user-model.js');
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
            name: value.name
        });
        if(existingPg) {
            return res.status(403).json({ error: 'PG with a same name and address already exists!!!' });
        }
        const pg = new Pg({ ...value, ownerId: req.userId });
        await pg.save();
        res.status(201).json(pg);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong while creating PG!!!s' });
    }
}

module.exports = pgCltr;
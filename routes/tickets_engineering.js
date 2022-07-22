const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Ticket = require('../models/Ticket')
const User = require('../models/User')

// @desc    Show add page 
// @route   GET /tickets/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('tickets/add')
})

// @desc    Process add form 
// @route   POST /tickets
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Ticket.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

// @desc    Show all engineering tickets 
// @route   GET /tickets
router.get('/', ensureAuth, async (req, res) => {
    try {
        const tickets = await Ticket.find({ team: 'engineering'}).populate('user').sort({ createdAt: 'desc'}).lean()
        res.render('tickets/engineering', {
            tickets,
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})




module.exports = router ;
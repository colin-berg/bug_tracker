const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Ticket = require('../models/Ticket')

// @desc    Login/Landing page 
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

// @desc    Dashboard page 
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            tickets,
        })
    } catch (error) {
        console.error(err)
        res.render('error/500')
    }
   
})


module.exports = router ;
const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Ticket = require('../models/Ticket')


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

// @desc    Show all tickets 
// @route   GET /tickets
router.get('/', ensureAuth, async (req, res) => {
    try {
        const tickets = await Ticket.find({ status: ['unassigned', 'in-progress', 'complete']}).populate('user').sort({ createdAt: 'desc'}).lean()
        res.render('tickets/index', {
            tickets,
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

// @desc    Show single ticket 
// @route   GET /tickets/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let ticket = await Ticket.findById(req.params.id).populate('user').lean()

        if (!ticket) {
            return res.render('error/404')
        }

        res.render('tickets/show', {
            ticket
        })
    } catch (error) {
        console.error(error)
        res.render('error/404')
    }
})


// @desc    Show edit page 
// @route   GET /tickets/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    const ticket = await Ticket.findOne({
        _id: req.params.id
    }).lean()

    if (!ticket) {
        return res.render('error/404')
    }

    try {
        res.render('tickets/edit', {
            ticket,
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }

    // if we want the logged in user to only be able to edit their own ticket

    // if (ticket.user != req.user.id) {
    //     res.redirect('/tickets')
    // } else {
    //     res.render('tickets/edit', {
    //         ticket,
    //     })
    // }

})

// @desc    Update ticket 
// @route   PUT /tickets/:id
router.put('/:id', ensureAuth, async (req, res) => {
    let ticket = await Ticket.findById(req.params.id).lean()

    if (!ticket) {
        return res.render('error/404')
    }

    try {
        ticket = await Ticket.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }

    // if (ticket.user != req.user.id) {
    //     res.redirect('/tickets')
    // } else {
    //     ticket = await Ticket.findOneAndUpdate({ _id: req.params.id }, req.body, {
    //         new: true,
    //         runValidators: true
    //     })
    //     res.redirect('/dashboard')
    // }



})

// @desc    delete ticket 
// @route   DELETE /tickets/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Ticket.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
})

// @desc    User tickets 
// @route   GET /tickets/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const tickets = await Ticket.find({
            user: req.params.userId,
            status: 'in-progress'
        }).populate('user').lean()

        res.render('tickets/index', {
            tickets
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})



module.exports = router ;
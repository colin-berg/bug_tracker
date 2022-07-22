const mongoose = require('mongoose')

let numWeeks = 2;
// let dueDate = now.setDate(now.getDate() + numWeeks * 7);

// let dueDate = Date.now + numWeeks * 7

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'unassigned',
        enum: ['unassigned', 'in-progress', 'complete']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    team: {
        type: String,
        default: 'engineering',
        enum: ['engineering', 'product', 'marketing']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    dateDue: {
        type: Date,
        required: false,
        default: Date.now + numWeeks * 7,
    }
});

module.exports = mongoose.model('Ticket', TicketSchema)
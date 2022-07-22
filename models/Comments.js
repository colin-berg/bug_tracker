const mongoose = require('mongoose')

const CommentsSchema = new mongoose.Schema({
    commentBody: {
        type: String,
        allowNull: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

})

module.exports = mongoose.model('Comments', CommentsSchema)
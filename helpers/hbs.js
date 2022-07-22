const moment = require('moment')

const Ticket = require('../models/Ticket')

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format)
    },

    // truncates the text in the cards on our ticket view 

    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
            let new_str = str + ''
            new_str = str.substr(0, len)
            new_str = str.substr(0, new_str.lastIndexOf(' '))
            new_str = new_str.length > 0 ? new_str : str.substr(0, len)
            return new_str + '...'
        }
        return str
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    stripBreakSpace: function (input) {
        return input.replace(/&nbsp;|-&gt;/g, ' ')
    },
    // editIcon: function (ticketUser, loggedUser, ticketId, floating = true) {
    //     if (ticketUser._id.toString() == loggedUser._id.toString()) {
    //         if (floating) {
    //             return `<a href="/tickets/edit/${ticketId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
    //         } else {
    //             return `<a href="/tickets/edit/${ticketId}"><i class="fas fa-edit"></i></a>`
    //         }
    //     } else {
    //         return ''
    //     }
    // },
    editIcon: function (ticketId, floating = true) {
        
        if (floating) {
            return `<a href="/tickets/edit/${ticketId}" class="btn-floating halfway-fab blue"><i class="far fa-edit fa-small"></i></a>`
        } else {
            return `<a href="/tickets/edit/${ticketId}"><i class="far fa-edit"></i></a>`
        }
        
    },
    select: function (selected, options) {
        return options.fn(this).replace(
            new RegExp(' value="' + selected + '"'), '$& selected="selected"$&'
        )
    },

    isUnassigned: function (status) {
        return status == 'unassigned';
    },

    isInProgress: function (status) {
        return status == 'in-progress';
    },

    isComplete: function (status) {
        return status == 'complete'
    },

    dueDateAlert: function () {
        let count = 0;
        for (const item in Ticket) {
            for (const dateDue in item) {
                if ((dateDue - Date.now()) <= 3) {
                    count += 1 
                }}
        return count
    }}, 

}
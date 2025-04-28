const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
userId: {type: String, required: true},
uid: {type: String, required: true},
company: {type: String, required: true},
hqAddress: {type: String, required: true},
workingHrs: {type: String, required: true},

}, {timestamps: true});

module.exports = mongoose.model('Agents', AgentSchema);
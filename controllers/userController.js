const User = require('../models/user')
const Skill = require('../models/skills')
const Agent = require('../models/agent')


module.exports = {
    updateUser: async(req, res) =>{
        try {
            await User.findByIdAndUpdate(req.user.id,
                {$set: req.body}, {new:true})
                res.status(200).json({status: true})
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    },

    updateProfileImage: async(req, res) =>{
        try {
            await User.findByIdAndUpdate(req.user.id,
                {$set: req.body}, {new:true})
                res.status(200).json({status: true})
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    },

    deleteUser: async(req, res) =>{
        try {
            await User.findByIdAndDelete(req.user.id)
            res.status(200).json({status: true})
        } catch (error) {
            res.status(500).json({error: error.message}) 
        }
    },

    getUser: async(req, res) =>{
        try {
            const profile = await User.findById(req.user.id)
            const {password, createdAt, updateAt, __v, ...userData} = profile._doc;
            res.status(200).json(userData)
        } catch (error) {
            res.status(500).json({error: error.message}) 
        }
    },

//skills
     addSkills: async(req, res) =>{
        const newSkill = new Skill({userId: req.user.id, skill: req.body.skill})
        try {
            await newSkill.save();
            await User.findByIdAndUpdate(req.user.id, {$set: {skills: true}})
            res.status(200).json({status: true})
        } catch (error) {
            res.status(500).json({error: error.message}) 
        }
     },

     getSkills: async(req, res) =>{
        const userId = req.user.id;
        try {
            const skills = await Skill.find({userId: userId}, {createdAt: 0, updateAt: 0, __v:0});

            if(skills.length===0){
                return res.status(200).json([]);
            }
            res.status(200).json(skills);
        } catch (error) {
            res.status(500).json({error: error.message}) 
        }
     },

     deleteSkills: async(req, res) =>{
        const id = req.params.id;
        try {
            await Skill.findByIdAndDelete(id)
            res.status(200).json({status: true})
        } catch (error) {
            res.status(500).json({error: error.message}) 
        }
     },

     //Agents
     updateAgent: async(req, res)=>{
        const id = req.params.id;

        try {
            const updatedAgent = await Agent.findByIdAndUpdate(id,
               {
                company: req.body.company,
            workingHrs: req.body.workingHrs,
            hqAddress: req.body.hqAddress
               }, {new: true});
               if(!updatedAgent){
                return res.status(404).json({status: false, message: "Agent not found"});
               }

           res.status(200).json({status: true}) 
        } catch (error) {
            res.status(500).json({error: error.message}) 
        }
     },

     addAgent: async(req, res)=>{
        const newAgent = new Agent({
            uid: req.body.id,
            userId: req.user.id,
            company: req.body.company,
            workingHrs: req.body.workingHrs,
            hqAddress: req.body.hqAddress
        });
        try {
           await newAgent.save();
           await User.findByIdAndUpdate(req.user.id, {$set: {isAgent: true}})
           res.status(200).json({status: true}) 
        } catch (error) {
            res.status(500).json({error: error.message}) 
        }
     },

     getAgent: async(req, res)=>{

        try {
        const agentData = await Agent.find({uid: req.params.uid}, {createdAt: 0, updatedAt: 0, __v:0});
        const agent = agentData[0];    
        res.status(200).json(agent)
        } catch (error) {
            res.status(500).json({error: error.message}) 
        }
     },

     getAgents: async(req, res)=>{
        try {
            const allActiveAgents = await User.aggregate([
                {$match: {isAgent: true}},
                {$sample: {size: 7}},
                // {
                //     $profile:{
                //         _id: 0,
                //         username: 1,
                //         profile: 1,
                //         uid: 1
                //     }
                // }
            ]);
            res.status(200).json(allActiveAgents);
        } catch (error) {
            res.status(500).json({error: error.message}) 
        }
     }
}
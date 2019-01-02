const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const ProjectsSchema = new mongoose.Schema({
    project_name: {
    type: String,
    required: true
  },
    city: {
      type: String,
      required: true
    },
    state: { 
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
});

ProjectsSchema.plugin(timestamp);

const Projects = mongoose.model('Projects', ProjectsSchema);
module.exports = Projects;
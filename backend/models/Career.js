import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
});

const careerSchema = new mongoose.Schema({
    heroTitle: { type: String, default: 'Join Our Team' },
    heroDescription: { type: String, default: 'At NazraKart, we are always looking for passionate, creative, and driven individuals to help us redefine e-commerce. Be part of our journey!' },
    jobs: {
        type: [jobSchema],
        default: [
            { title: 'Frontend Developer', department: 'Engineering', location: 'Remote / Mumbai', type: 'Full-time' },
            { title: 'UX Designer', department: 'Design', location: 'Mumbai', type: 'Full-time' },
            { title: 'Marketing Manager', department: 'Marketing', location: 'Remote', type: 'Full-time' },
            { title: 'Customer Support Executive', department: 'Support', location: 'Mumbai', type: 'Full-time' }
        ]
    }
}, { timestamps: true });

const Career = mongoose.model('Career', careerSchema);
export default Career;

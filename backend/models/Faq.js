import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Please add a question'],
        trim: true,
        maxlength: [500, 'Question cannot be more than 500 characters']
    },
    answer: {
        type: String,
        required: [true, 'Please add an answer'],
        maxlength: [2000, 'Answer cannot be more than 2000 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Faq = mongoose.model('Faq', faqSchema);

export default Faq;

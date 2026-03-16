import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    }
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
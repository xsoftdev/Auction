import mongoose from 'mongoose';

interface Partition {
    _id?: string;
    name: string;
    link: string;
    status: 'active' | 'archived';
    createdAt: Date;
    subcategories: Partition[];
    lots?: string[];
}

const PartitionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    subcategories: [{
        name: { type: String, required: true },
        link: { type: String, required: true },
        status: {
            type: String,
            enum: ['active', 'archived'],
            default: 'active'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        subcategories: [{
            name: { type: String, required: true },
            link: { type: String, required: true },
            status: {
                type: String,
                enum: ['active', 'archived'],
                default: 'active'
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            lots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lot' }]
        }],
        lots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lot' }]
    }],
    lots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lot' }]
});

export const Partition = mongoose.model('Partition', PartitionSchema);
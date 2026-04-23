import mongoose from 'mongoose';
const fieldSchema = new mongoose.Schema({
    id: { type: String, required: true }, // Using 'id' to match existing frontend/seed
    label: { type: String, required: true },
    type: {
        type: String,
        enum: ['text', 'email', 'phone', 'number', 'textarea', 'dropdown', 'file', 'date', 'mcq', 'radio', 'checkbox', 'rating', 'section'],
        required: true
    },
    required: { type: Boolean, default: false },
    options: [String],
    placeholder: String,
    minLength: Number,
    maxLength: Number,
    min: Number,
    max: Number,
    fileConfig: {
        allowedFormats: [String],
        maxSizeMB: Number
    },
    // Branching/Quiz specific
    is_trigger: { type: Boolean, default: false },
    show_when: {
        field: String,
        equals: mongoose.Schema.Types.Mixed
    },
    children: [mongoose.Schema.Types.Mixed], // Recursive fields for sections
    correct: mongoose.Schema.Types.Mixed,
    points: Number,
    section_type: String
});
const formSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    formType: { type: String, enum: ['normal', 'branching', 'quiz', 'multi'], default: 'normal' },
    status: { type: String, enum: ['active', 'expired', 'draft'], default: 'draft' },
    fields: [fieldSchema],
    expiresAt: Date,
    allowEdit: { type: Boolean, default: false },
    shareableLink: { type: String, unique: true },
    reviewConfig: {
        mode: { type: String, enum: ['marks', 'grades'], default: 'marks' },
        maxMarks: Number,
        gradeOptions: [String]
    },
    settings: {
        time_limit: Number, // in minutes
        passing_score: Number, // percentage
        negative_marking: { type: Boolean, default: false },
        shuffle_options: { type: Boolean, default: false },
        total_marks: Number
    }
}, { timestamps: true });
export const Form = mongoose.model('Form', formSchema);
//# sourceMappingURL=Form.js.map
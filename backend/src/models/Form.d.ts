import mongoose from 'mongoose';
export declare const Form: mongoose.Model<{
    fields: mongoose.Types.DocumentArray<{
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, {}, {}> & {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }>;
    title: string;
    formType: "multi" | "normal" | "branching" | "quiz";
    status: "active" | "expired" | "draft";
    allowEdit: boolean;
    description?: string | null;
    expiresAt?: NativeDate | null;
    adminId?: mongoose.Types.ObjectId | null;
    shareableLink?: string | null;
    reviewConfig?: {
        mode: "marks" | "grades";
        gradeOptions: string[];
        maxMarks?: number | null;
    } | null;
    settings?: {
        negative_marking: boolean;
        shuffle_options: boolean;
        time_limit?: number | null;
        passing_score?: number | null;
        total_marks?: number | null;
    } | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    fields: mongoose.Types.DocumentArray<{
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, {}, {}> & {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }>;
    title: string;
    formType: "multi" | "normal" | "branching" | "quiz";
    status: "active" | "expired" | "draft";
    allowEdit: boolean;
    description?: string | null;
    expiresAt?: NativeDate | null;
    adminId?: mongoose.Types.ObjectId | null;
    shareableLink?: string | null;
    reviewConfig?: {
        mode: "marks" | "grades";
        gradeOptions: string[];
        maxMarks?: number | null;
    } | null;
    settings?: {
        negative_marking: boolean;
        shuffle_options: boolean;
        time_limit?: number | null;
        passing_score?: number | null;
        total_marks?: number | null;
    } | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    fields: mongoose.Types.DocumentArray<{
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, {}, {}> & {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }>;
    title: string;
    formType: "multi" | "normal" | "branching" | "quiz";
    status: "active" | "expired" | "draft";
    allowEdit: boolean;
    description?: string | null;
    expiresAt?: NativeDate | null;
    adminId?: mongoose.Types.ObjectId | null;
    shareableLink?: string | null;
    reviewConfig?: {
        mode: "marks" | "grades";
        gradeOptions: string[];
        maxMarks?: number | null;
    } | null;
    settings?: {
        negative_marking: boolean;
        shuffle_options: boolean;
        time_limit?: number | null;
        passing_score?: number | null;
        total_marks?: number | null;
    } | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    fields: mongoose.Types.DocumentArray<{
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, {}, {}> & {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }>;
    title: string;
    formType: "multi" | "normal" | "branching" | "quiz";
    status: "active" | "expired" | "draft";
    allowEdit: boolean;
    description?: string | null;
    expiresAt?: NativeDate | null;
    adminId?: mongoose.Types.ObjectId | null;
    shareableLink?: string | null;
    reviewConfig?: {
        mode: "marks" | "grades";
        gradeOptions: string[];
        maxMarks?: number | null;
    } | null;
    settings?: {
        negative_marking: boolean;
        shuffle_options: boolean;
        time_limit?: number | null;
        passing_score?: number | null;
        total_marks?: number | null;
    } | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    fields: mongoose.Types.DocumentArray<{
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, {}, {}> & {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }>;
    title: string;
    formType: "multi" | "normal" | "branching" | "quiz";
    status: "active" | "expired" | "draft";
    allowEdit: boolean;
    description?: string | null;
    expiresAt?: NativeDate | null;
    adminId?: mongoose.Types.ObjectId | null;
    shareableLink?: string | null;
    reviewConfig?: {
        mode: "marks" | "grades";
        gradeOptions: string[];
        maxMarks?: number | null;
    } | null;
    settings?: {
        negative_marking: boolean;
        shuffle_options: boolean;
        time_limit?: number | null;
        passing_score?: number | null;
        total_marks?: number | null;
    } | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    fields: mongoose.Types.DocumentArray<{
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, {}, {}> & {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }>;
    title: string;
    formType: "multi" | "normal" | "branching" | "quiz";
    status: "active" | "expired" | "draft";
    allowEdit: boolean;
    description?: string | null;
    expiresAt?: NativeDate | null;
    adminId?: mongoose.Types.ObjectId | null;
    shareableLink?: string | null;
    reviewConfig?: {
        mode: "marks" | "grades";
        gradeOptions: string[];
        maxMarks?: number | null;
    } | null;
    settings?: {
        negative_marking: boolean;
        shuffle_options: boolean;
        time_limit?: number | null;
        passing_score?: number | null;
        total_marks?: number | null;
    } | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    fields: mongoose.Types.DocumentArray<{
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, {}, {}> & {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }>;
    title: string;
    formType: "multi" | "normal" | "branching" | "quiz";
    status: "active" | "expired" | "draft";
    allowEdit: boolean;
    description?: string | null;
    expiresAt?: NativeDate | null;
    adminId?: mongoose.Types.ObjectId | null;
    shareableLink?: string | null;
    reviewConfig?: {
        mode: "marks" | "grades";
        gradeOptions: string[];
        maxMarks?: number | null;
    } | null;
    settings?: {
        negative_marking: boolean;
        shuffle_options: boolean;
        time_limit?: number | null;
        passing_score?: number | null;
        total_marks?: number | null;
    } | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    fields: mongoose.Types.DocumentArray<{
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }, {}, {}> & {
        id: string;
        type: "number" | "email" | "date" | "text" | "phone" | "textarea" | "dropdown" | "file" | "mcq" | "radio" | "checkbox" | "rating" | "section";
        required: boolean;
        label: string;
        options: string[];
        is_trigger: boolean;
        children: any[];
        min?: number | null;
        max?: number | null;
        minLength?: number | null;
        maxLength?: number | null;
        placeholder?: string | null;
        correct?: any;
        points?: number | null;
        section_type?: string | null;
        fileConfig?: {
            allowedFormats: string[];
            maxSizeMB?: number | null;
        } | null;
        show_when?: {
            equals?: any;
            field?: string | null;
        } | null;
    }>;
    title: string;
    formType: "multi" | "normal" | "branching" | "quiz";
    status: "active" | "expired" | "draft";
    allowEdit: boolean;
    description?: string | null;
    expiresAt?: NativeDate | null;
    adminId?: mongoose.Types.ObjectId | null;
    shareableLink?: string | null;
    reviewConfig?: {
        mode: "marks" | "grades";
        gradeOptions: string[];
        maxMarks?: number | null;
    } | null;
    settings?: {
        negative_marking: boolean;
        shuffle_options: boolean;
        time_limit?: number | null;
        passing_score?: number | null;
        total_marks?: number | null;
    } | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Form.d.ts.map
import mongoose from 'mongoose';
export declare const Submission: mongoose.Model<{
    status: "pending" | "approved" | "rejected";
    formId: mongoose.Types.ObjectId;
    isDraft: boolean;
    responses: mongoose.Types.DocumentArray<{
        value?: any;
        fieldId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        value?: any;
        fieldId?: string | null;
    }, {}, {}> & {
        value?: any;
        fieldId?: string | null;
    }>;
    files: mongoose.Types.DocumentArray<{
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, {}, {}> & {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }>;
    submittedAt: NativeDate;
    currentLevel: number;
    reviews: mongoose.Types.DocumentArray<{
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, {}, {}> & {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }>;
    userId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
    userName?: string | null;
    userEmail?: string | null;
    formTitle?: string | null;
    lastEditedAt?: NativeDate | null;
    averageMarks?: number | null;
    finalGrade?: string | null;
    score?: {
        totalPoints?: number | null;
        earnedPoints?: number | null;
        percentage?: number | null;
        passed?: boolean | null;
    } | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    status: "pending" | "approved" | "rejected";
    formId: mongoose.Types.ObjectId;
    isDraft: boolean;
    responses: mongoose.Types.DocumentArray<{
        value?: any;
        fieldId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        value?: any;
        fieldId?: string | null;
    }, {}, {}> & {
        value?: any;
        fieldId?: string | null;
    }>;
    files: mongoose.Types.DocumentArray<{
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, {}, {}> & {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }>;
    submittedAt: NativeDate;
    currentLevel: number;
    reviews: mongoose.Types.DocumentArray<{
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, {}, {}> & {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }>;
    userId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
    userName?: string | null;
    userEmail?: string | null;
    formTitle?: string | null;
    lastEditedAt?: NativeDate | null;
    averageMarks?: number | null;
    finalGrade?: string | null;
    score?: {
        totalPoints?: number | null;
        earnedPoints?: number | null;
        percentage?: number | null;
        passed?: boolean | null;
    } | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    status: "pending" | "approved" | "rejected";
    formId: mongoose.Types.ObjectId;
    isDraft: boolean;
    responses: mongoose.Types.DocumentArray<{
        value?: any;
        fieldId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        value?: any;
        fieldId?: string | null;
    }, {}, {}> & {
        value?: any;
        fieldId?: string | null;
    }>;
    files: mongoose.Types.DocumentArray<{
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, {}, {}> & {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }>;
    submittedAt: NativeDate;
    currentLevel: number;
    reviews: mongoose.Types.DocumentArray<{
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, {}, {}> & {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }>;
    userId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
    userName?: string | null;
    userEmail?: string | null;
    formTitle?: string | null;
    lastEditedAt?: NativeDate | null;
    averageMarks?: number | null;
    finalGrade?: string | null;
    score?: {
        totalPoints?: number | null;
        earnedPoints?: number | null;
        percentage?: number | null;
        passed?: boolean | null;
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
    status: "pending" | "approved" | "rejected";
    formId: mongoose.Types.ObjectId;
    isDraft: boolean;
    responses: mongoose.Types.DocumentArray<{
        value?: any;
        fieldId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        value?: any;
        fieldId?: string | null;
    }, {}, {}> & {
        value?: any;
        fieldId?: string | null;
    }>;
    files: mongoose.Types.DocumentArray<{
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, {}, {}> & {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }>;
    submittedAt: NativeDate;
    currentLevel: number;
    reviews: mongoose.Types.DocumentArray<{
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, {}, {}> & {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }>;
    userId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
    userName?: string | null;
    userEmail?: string | null;
    formTitle?: string | null;
    lastEditedAt?: NativeDate | null;
    averageMarks?: number | null;
    finalGrade?: string | null;
    score?: {
        totalPoints?: number | null;
        earnedPoints?: number | null;
        percentage?: number | null;
        passed?: boolean | null;
    } | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    status: "pending" | "approved" | "rejected";
    formId: mongoose.Types.ObjectId;
    isDraft: boolean;
    responses: mongoose.Types.DocumentArray<{
        value?: any;
        fieldId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        value?: any;
        fieldId?: string | null;
    }, {}, {}> & {
        value?: any;
        fieldId?: string | null;
    }>;
    files: mongoose.Types.DocumentArray<{
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, {}, {}> & {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }>;
    submittedAt: NativeDate;
    currentLevel: number;
    reviews: mongoose.Types.DocumentArray<{
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, {}, {}> & {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }>;
    userId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
    userName?: string | null;
    userEmail?: string | null;
    formTitle?: string | null;
    lastEditedAt?: NativeDate | null;
    averageMarks?: number | null;
    finalGrade?: string | null;
    score?: {
        totalPoints?: number | null;
        earnedPoints?: number | null;
        percentage?: number | null;
        passed?: boolean | null;
    } | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    status: "pending" | "approved" | "rejected";
    formId: mongoose.Types.ObjectId;
    isDraft: boolean;
    responses: mongoose.Types.DocumentArray<{
        value?: any;
        fieldId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        value?: any;
        fieldId?: string | null;
    }, {}, {}> & {
        value?: any;
        fieldId?: string | null;
    }>;
    files: mongoose.Types.DocumentArray<{
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, {}, {}> & {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }>;
    submittedAt: NativeDate;
    currentLevel: number;
    reviews: mongoose.Types.DocumentArray<{
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, {}, {}> & {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }>;
    userId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
    userName?: string | null;
    userEmail?: string | null;
    formTitle?: string | null;
    lastEditedAt?: NativeDate | null;
    averageMarks?: number | null;
    finalGrade?: string | null;
    score?: {
        totalPoints?: number | null;
        earnedPoints?: number | null;
        percentage?: number | null;
        passed?: boolean | null;
    } | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    status: "pending" | "approved" | "rejected";
    formId: mongoose.Types.ObjectId;
    isDraft: boolean;
    responses: mongoose.Types.DocumentArray<{
        value?: any;
        fieldId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        value?: any;
        fieldId?: string | null;
    }, {}, {}> & {
        value?: any;
        fieldId?: string | null;
    }>;
    files: mongoose.Types.DocumentArray<{
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, {}, {}> & {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }>;
    submittedAt: NativeDate;
    currentLevel: number;
    reviews: mongoose.Types.DocumentArray<{
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, {}, {}> & {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }>;
    userId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
    userName?: string | null;
    userEmail?: string | null;
    formTitle?: string | null;
    lastEditedAt?: NativeDate | null;
    averageMarks?: number | null;
    finalGrade?: string | null;
    score?: {
        totalPoints?: number | null;
        earnedPoints?: number | null;
        percentage?: number | null;
        passed?: boolean | null;
    } | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    status: "pending" | "approved" | "rejected";
    formId: mongoose.Types.ObjectId;
    isDraft: boolean;
    responses: mongoose.Types.DocumentArray<{
        value?: any;
        fieldId?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        value?: any;
        fieldId?: string | null;
    }, {}, {}> & {
        value?: any;
        fieldId?: string | null;
    }>;
    files: mongoose.Types.DocumentArray<{
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }, {}, {}> & {
        fieldId?: string | null;
        originalName?: string | null;
        storedPath?: string | null;
        mimeType?: string | null;
        sizeBytes?: number | null;
    }>;
    submittedAt: NativeDate;
    currentLevel: number;
    reviews: mongoose.Types.DocumentArray<{
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }, {}, {}> & {
        reviewedAt: NativeDate;
        description?: string | null;
        reviewerName?: string | null;
        marksGiven?: number | null;
        gradeGiven?: string | null;
        levelId?: mongoose.Types.ObjectId | null;
        reviewerId?: mongoose.Types.ObjectId | null;
    }>;
    userId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
    userName?: string | null;
    userEmail?: string | null;
    formTitle?: string | null;
    lastEditedAt?: NativeDate | null;
    averageMarks?: number | null;
    finalGrade?: string | null;
    score?: {
        totalPoints?: number | null;
        earnedPoints?: number | null;
        percentage?: number | null;
        passed?: boolean | null;
    } | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Submission.d.ts.map
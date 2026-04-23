import mongoose from 'mongoose';
export declare const Level: mongoose.Model<{
    name: string;
    formId: mongoose.Types.ObjectId;
    levelNumber: number;
    assignedReviewers: mongoose.Types.ObjectId[];
    submissions: mongoose.Types.ObjectId[];
    blindReview: boolean;
    scoringType: "form" | "question";
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    formId: mongoose.Types.ObjectId;
    levelNumber: number;
    assignedReviewers: mongoose.Types.ObjectId[];
    submissions: mongoose.Types.ObjectId[];
    blindReview: boolean;
    scoringType: "form" | "question";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    formId: mongoose.Types.ObjectId;
    levelNumber: number;
    assignedReviewers: mongoose.Types.ObjectId[];
    submissions: mongoose.Types.ObjectId[];
    blindReview: boolean;
    scoringType: "form" | "question";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    formId: mongoose.Types.ObjectId;
    levelNumber: number;
    assignedReviewers: mongoose.Types.ObjectId[];
    submissions: mongoose.Types.ObjectId[];
    blindReview: boolean;
    scoringType: "form" | "question";
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    formId: mongoose.Types.ObjectId;
    levelNumber: number;
    assignedReviewers: mongoose.Types.ObjectId[];
    submissions: mongoose.Types.ObjectId[];
    blindReview: boolean;
    scoringType: "form" | "question";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    formId: mongoose.Types.ObjectId;
    levelNumber: number;
    assignedReviewers: mongoose.Types.ObjectId[];
    submissions: mongoose.Types.ObjectId[];
    blindReview: boolean;
    scoringType: "form" | "question";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    formId: mongoose.Types.ObjectId;
    levelNumber: number;
    assignedReviewers: mongoose.Types.ObjectId[];
    submissions: mongoose.Types.ObjectId[];
    blindReview: boolean;
    scoringType: "form" | "question";
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    formId: mongoose.Types.ObjectId;
    levelNumber: number;
    assignedReviewers: mongoose.Types.ObjectId[];
    submissions: mongoose.Types.ObjectId[];
    blindReview: boolean;
    scoringType: "form" | "question";
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Level.d.ts.map
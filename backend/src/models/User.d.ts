import mongoose from 'mongoose';
export declare const User: mongoose.Model<{
    email: string;
    role: "admin" | "reviewer" | "functionary" | "teacher";
    assignedLevels: mongoose.Types.ObjectId[];
    isActive: boolean;
    loginAttempts: number;
    username?: string | null;
    passwordHash?: string | null;
    profile?: {
        fullName: string;
        phone?: string | null;
        schoolName?: string | null;
        schoolCode?: string | null;
        district?: string | null;
    } | null;
    lockUntil?: number | null;
    createdBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    email: string;
    role: "admin" | "reviewer" | "functionary" | "teacher";
    assignedLevels: mongoose.Types.ObjectId[];
    isActive: boolean;
    loginAttempts: number;
    username?: string | null;
    passwordHash?: string | null;
    profile?: {
        fullName: string;
        phone?: string | null;
        schoolName?: string | null;
        schoolCode?: string | null;
        district?: string | null;
    } | null;
    lockUntil?: number | null;
    createdBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    email: string;
    role: "admin" | "reviewer" | "functionary" | "teacher";
    assignedLevels: mongoose.Types.ObjectId[];
    isActive: boolean;
    loginAttempts: number;
    username?: string | null;
    passwordHash?: string | null;
    profile?: {
        fullName: string;
        phone?: string | null;
        schoolName?: string | null;
        schoolCode?: string | null;
        district?: string | null;
    } | null;
    lockUntil?: number | null;
    createdBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    email: string;
    role: "admin" | "reviewer" | "functionary" | "teacher";
    assignedLevels: mongoose.Types.ObjectId[];
    isActive: boolean;
    loginAttempts: number;
    username?: string | null;
    passwordHash?: string | null;
    profile?: {
        fullName: string;
        phone?: string | null;
        schoolName?: string | null;
        schoolCode?: string | null;
        district?: string | null;
    } | null;
    lockUntil?: number | null;
    createdBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    email: string;
    role: "admin" | "reviewer" | "functionary" | "teacher";
    assignedLevels: mongoose.Types.ObjectId[];
    isActive: boolean;
    loginAttempts: number;
    username?: string | null;
    passwordHash?: string | null;
    profile?: {
        fullName: string;
        phone?: string | null;
        schoolName?: string | null;
        schoolCode?: string | null;
        district?: string | null;
    } | null;
    lockUntil?: number | null;
    createdBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    email: string;
    role: "admin" | "reviewer" | "functionary" | "teacher";
    assignedLevels: mongoose.Types.ObjectId[];
    isActive: boolean;
    loginAttempts: number;
    username?: string | null;
    passwordHash?: string | null;
    profile?: {
        fullName: string;
        phone?: string | null;
        schoolName?: string | null;
        schoolCode?: string | null;
        district?: string | null;
    } | null;
    lockUntil?: number | null;
    createdBy?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    email: string;
    role: "admin" | "reviewer" | "functionary" | "teacher";
    assignedLevels: mongoose.Types.ObjectId[];
    isActive: boolean;
    loginAttempts: number;
    username?: string | null;
    passwordHash?: string | null;
    profile?: {
        fullName: string;
        phone?: string | null;
        schoolName?: string | null;
        schoolCode?: string | null;
        district?: string | null;
    } | null;
    lockUntil?: number | null;
    createdBy?: mongoose.Types.ObjectId | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    email: string;
    role: "admin" | "reviewer" | "functionary" | "teacher";
    assignedLevels: mongoose.Types.ObjectId[];
    isActive: boolean;
    loginAttempts: number;
    username?: string | null;
    passwordHash?: string | null;
    profile?: {
        fullName: string;
        phone?: string | null;
        schoolName?: string | null;
        schoolCode?: string | null;
        district?: string | null;
    } | null;
    lockUntil?: number | null;
    createdBy?: mongoose.Types.ObjectId | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=User.d.ts.map
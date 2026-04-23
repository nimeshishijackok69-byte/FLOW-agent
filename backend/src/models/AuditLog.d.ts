import mongoose from 'mongoose';
export declare const AuditLog: mongoose.Model<{
    createdAt: NativeDate;
    action: string;
    details?: any;
    userId?: mongoose.Types.ObjectId | null;
    targetType?: string | null;
    targetId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    action: string;
    details?: any;
    userId?: mongoose.Types.ObjectId | null;
    targetType?: string | null;
    targetId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    createdAt: NativeDate;
    action: string;
    details?: any;
    userId?: mongoose.Types.ObjectId | null;
    targetType?: string | null;
    targetId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: NativeDate;
    action: string;
    details?: any;
    userId?: mongoose.Types.ObjectId | null;
    targetType?: string | null;
    targetId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    action: string;
    details?: any;
    userId?: mongoose.Types.ObjectId | null;
    targetType?: string | null;
    targetId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    createdAt: NativeDate;
    action: string;
    details?: any;
    userId?: mongoose.Types.ObjectId | null;
    targetType?: string | null;
    targetId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    createdAt: NativeDate;
    action: string;
    details?: any;
    userId?: mongoose.Types.ObjectId | null;
    targetType?: string | null;
    targetId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    action: string;
    details?: any;
    userId?: mongoose.Types.ObjectId | null;
    targetType?: string | null;
    targetId?: mongoose.Types.ObjectId | null;
    metadata?: {
        ip?: string | null;
        userAgent?: string | null;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=AuditLog.d.ts.map
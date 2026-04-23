import { Response } from 'express';
export declare const generateTokens: (user: any) => {
    accessToken: string;
    refreshToken: string;
};
export declare const setRefreshTokenCookie: (res: Response, token: string) => void;
//# sourceMappingURL=jwt.d.ts.map
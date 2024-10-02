import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export default class AuthenticationFilter {

    authFilter(req: any, res: Response, next: NextFunction) {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }


        try {
            const decoded = jwt.verify(token, config.SECRET_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    authorizeRole(role: string) {
        return (req: any, res: Response, next: NextFunction) => {
            if (req.user && req.user.role === role) {
                next();
            } else {
                res.status(403).json({ message: 'Forbidden' });
            }
        };
    }
}

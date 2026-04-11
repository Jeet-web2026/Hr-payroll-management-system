import { Request, Response } from 'express';

export const onlyJsonValidation = (req: Request, res: Response, next: any) => {
  if (req.method !== 'GET' && !req.is('application/json')) {
    return res.status(415).json({
      statusCode: 415,
      message: 'Only JSON format is allowed (Content-Type: application/json)',
      error: 'Unsupported Media Type',
    });
  }
  next();
};

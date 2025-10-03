import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
export const validateRequest = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;

      next();
    } catch (error) {
      console.error('error in zod middleware', error);
      if (error instanceof z.ZodError) {
        //@ts-ignore
        const errors = error.errors.map((e) => ({
          message: `${e.path.join('.')} is ${e.message}`,
        }));
        res.status(400).json({ error: 'Validation Error', errors });
      } else {
        next(error);
      }
    }
  };
};

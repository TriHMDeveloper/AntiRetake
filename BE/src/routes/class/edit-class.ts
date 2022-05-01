import express, { NextFunction, Request, Response } from 'express';
import { Class, School, User } from '../../models/';
import { decodeToken, validateRequest } from '../../middlewares';
import {
  BadRequestError,
  ForbiddenError,
  NotAuthorizedError,
} from '../../errors';
import { body } from 'express-validator';

// eslint-disable-next-line new-cap
const router = express.Router();

router.put(
  '/api/classes/:id',
  decodeToken,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('school').notEmpty().withMessage('School is required'),
    body('accessModifier').notEmpty().withMessage('Private is required'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.currentUser) {
        const { name, school, description, accessModifier } = req.body;
        const classId = req.params.id;
        const getschool = await School.findById(school);
        const currentUserUid = req.currentUser?.uid;
        const user = await User.findOne({ uid: currentUserUid });
        const currentUserId = user?.id;

        const currentClass = await Class.findById(classId).populate({
          path: 'owner',
          select: 'email',
        });
        const classOwnerId = currentClass?.owner.id;

        const isRemovable =
          currentUserId.toString() === classOwnerId.toString();

        if (!isRemovable) {
          throw new ForbiddenError();
        }

        const checkNameIsExist = await Class.findOne({
          owner: user?.id,
          name: name,
        });
        const checkOldNameClass = await Class.findById(classId);
        const oldName = checkOldNameClass?.name as string;

        if (!checkNameIsExist || oldName === name) {
          await Class.findByIdAndUpdate(classId, {
            name: name,
            school: getschool,
            description: description,
            accessModifier: accessModifier,
          });
          res.status(201).send('Sucessfull');
        } else {
          throw new BadRequestError('Name is duplicate');
        }
      } else {
        throw new NotAuthorizedError();
      }
    } catch (error) {
      next(error);
    }
  }
);

export { router as editClassRouter };

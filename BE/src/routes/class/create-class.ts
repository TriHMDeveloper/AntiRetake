import express, { NextFunction, Request, Response } from 'express';
import { Class, User, School } from '../../models/';
import { decodeToken, validateRequest } from '../../middlewares';
import { ClassRole } from '../../constants';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { body } from 'express-validator';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/classes',
  decodeToken,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('school').notEmpty().withMessage('School is required'),
    body('accessModifier')
      .notEmpty()
      .withMessage('Access modifier is required'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.currentUser) {
        const { name, school, description, accessModifier } = req.body;
        const currentUserUid = req.currentUser?.uid;
        const user = await User.findOne({ uid: currentUserUid });
        const checkNameIsExist = await Class.findOne({
          owner: user?.id,
          name: name,
        });

        if (!checkNameIsExist) {
          const getschool = await School.findById(school);
          const member = {
            member: user!,
            joinedAt: new Date(),
            role: ClassRole.OWNER,
          };
          const newClass = Class.build({
            name,
            owner: user!,
            school: getschool!,
            description,
            accessModifier,
            inviteLink: 'abc',
            studySetList: [],
            folderList: [],
            memberList: [member],
            joinRequestList: [],
            inviteList: [],
          });
          await newClass.save();
          await Class.findByIdAndUpdate(newClass.id, {
            inviteLink: `https://antiretake.xyz/classes/${newClass.id}`,
          });
          await User.findByIdAndUpdate(user?.id, {
            $push: { classList: newClass },
          });
          const getClass = await Class.findById(newClass.id);
          res.status(201).send({ getClass });
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

export { router as createClassRouter };

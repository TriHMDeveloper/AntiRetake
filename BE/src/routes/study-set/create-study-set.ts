import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { AccessModifier } from '../../constants';
import { decodeToken, validateRequest } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { Subject, Textbook, User, Flashcard, StudySet } from '../../models';
import mongoose from 'mongoose';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/sets/create',
  decodeToken,
  [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Minimum length must be 2 and maximum length must be 50'),
    body('accessModifier')
      .isIn([AccessModifier.PRIVATE, AccessModifier.PUBLIC])
      .withMessage('Access modifier not found'),
    body('flashcardList')
      .isArray({ min: 4 })
      .withMessage('Flash card list must have at least 4 flash cards'),
    body('flashcardList.*.term')
      .notEmpty()
      .withMessage('Flash card must have term and definition'),
    body('flashcardList.*.definition')
      .notEmpty()
      .withMessage('Flash card must have term and definition'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const {
        name,
        accessModifier,
        subject,
        textbook,
        description,
        flashcardList,
      } = req.body;

      let newTextbook;
      let newSubject;

      const currentUserUid = req.currentUser?.uid;
      const user = await User.findOne({ uid: currentUserUid });

      const checkNameIsExist = await StudySet.findOne({
        owner: user?.id,
        name: name,
      });

      if (checkNameIsExist) {
        throw new BadRequestError('Name is duplicate');
      }

      const isTextbookExist = (await Textbook.count({ name: textbook })) > 0;
      if (!isTextbookExist) {
        newTextbook = Textbook.build({
          name: textbook,
        });
        await newTextbook.save();
      } else {
        newTextbook = await Textbook.findOne({
          name: textbook,
        });
      }

      const isSubjectExist = (await Subject.count({ name: subject })) > 0;
      if (!isSubjectExist) {
        newSubject = Subject.build({
          name: subject,
        });
        await newSubject.save();
      } else {
        newSubject = await Subject.findOne({
          name: subject,
        });
      }

      const flashcards = await Flashcard.insertMany(flashcardList);

      const newStudySet = StudySet.build({
        name: name,
        owner: user!,
        accessModifier,
        subject: newSubject!,
        textbook: newTextbook!,
        description: description,
        rateList: [],
        flashcardList: flashcards,
      });

      await newStudySet.save();
      await User.findByIdAndUpdate(user?.id, {
        $push: { studySetList: newStudySet },
      });
      const getStudySet = await StudySet.findById(newStudySet.id);
      res.status(201).send(getStudySet);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as createStudySetRouter };

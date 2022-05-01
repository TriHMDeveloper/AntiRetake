import express, { NextFunction, Request, Response } from 'express';
import { decodeToken } from '../../middlewares';
import { Flashcard, StudySet, User } from '../../models';
import { SaveFlashcardRequest } from '../../types';
import {
  BadRequestError,
  ForbiddenError,
  NotAuthorizedError,
} from '../../errors';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/sets/flashcards/:id/save',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const currentUser = req.currentUser;
      const user = await User.findOne({ uid: currentUser?.uid });

      const flashCardId = req.params.id;

      const request: SaveFlashcardRequest = req.body;

      const flashcard = await Flashcard.findById(flashCardId);

      const studySetId = request.studySetId;

      const studySet = await StudySet.findById(studySetId).populate({
        path: 'owner',
        select: 'email',
      });

      if (studySet?.owner.id.toString() !== user?._id.toString()) {
        throw new ForbiddenError();
      }

      const cloneFlashcard = Flashcard.build({
        term: flashcard?.term as string,
        definition: flashcard?.definition as string,
      });
      await cloneFlashcard.save();

      await StudySet.findByIdAndUpdate(studySetId, {
        $push: {
          flashcardList: cloneFlashcard.id,
        },
      });

      res.status(201).send('Successfully');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as saveFlashcardRouter };

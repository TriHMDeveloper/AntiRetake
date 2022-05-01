import express, { NextFunction, Request, Response } from 'express';
import { LearnStatus } from '../../constants';
import { decodeToken } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { User } from '../../models';
import { LearnSet, LearnStudySet } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/sets/:id/learn',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const studySetId = req.params.id;
      const currentUser = await User.findOne({
        uid: req.currentUser?.uid,
      });
      const currentUserId = currentUser?.id;
      const learnedFlashcardIdList = req.body.flashcardIds;

      await User.updateOne(
        {
          _id: currentUserId,
          'learnList.studySetId': studySetId,
        },
        {
          $set: {
            'learnList.$[].flashcardList.$[flashcard].status':
              LearnStatus.LEARNED,
          },
        },
        {
          arrayFilters: [
            {
              'flashcard.flashcardId': {
                $in: learnedFlashcardIdList,
              },
            },
          ],
        }
      );

      const userAfterLearn = await User.findOne({
        uid: req.currentUser?.uid,
      })
        .populate({
          path: 'learnList.studySetId',
          select: 'id',
        })
        .populate({
          path: 'learnList.flashcardList.flashcardId',
          select: ['term', 'definition'],
        });
      const learnSet: LearnSet = userAfterLearn?.learnList.find(
        (element) => element.studySetId.id === studySetId
      ) as LearnSet;
      const flashcardList = learnSet.flashcardList.map((flashcard) => {
        return {
          id: flashcard.flashcardId.id,
          term: flashcard.flashcardId.term,
          definition: flashcard.flashcardId.definition,
          status: flashcard.status,
        };
      });

      const response: LearnStudySet = {
        studySetId: learnSet?.studySetId.id,
        flashcardList: flashcardList,
        numOfFlashcards: learnSet.flashcardList.length,
      };
      res.status(201).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as setLearnStudySetRouter };

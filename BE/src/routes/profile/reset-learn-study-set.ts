import express, { NextFunction, Request, Response } from 'express';
import { LearnStatus } from '../../constants';
import { decodeToken } from '../../middlewares';
import { User } from '../../models';
import { LearnSet, LearnStudySet } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/sets/:id/learn/reset',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studySetId = req.params.id;
      const currentUser = await User.findOne({
        uid: req.currentUser?.uid,
      });
      const currentUserId = currentUser?.id;

      await User.updateOne(
        {
          _id: currentUserId,
          'learnList.studySetId': studySetId,
        },
        {
          $set: {
            'learnList.$[].flashcardList.$[].status': LearnStatus.NOT_LEARNED,
          },
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

export { router as resetLearnStudySetRouter };

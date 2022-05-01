import express, { NextFunction, Request, Response } from 'express';
import { SortBy } from '../../constants/filter';
import { StudySet } from '../../models';
import { BadRequestError } from '../../errors';
import { Flashcard, FlashcardResponse } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/sets/:studySetId/flashcards',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit);

      const studyset = await StudySet.findById(req.params.studySetId)
        .populate({
          path: 'flashcardList',
          options: { limit: limit },
          select: ['term', 'definition'],
        })
        .catch((error) => {
          throw new BadRequestError('Study set is not exist !');
        });

      const getStudysetToCount = await StudySet.findById(req.params.studySetId);
      const totalRecords = Number(getStudysetToCount?.flashcardList.length);
      const isEnd = totalRecords <= limit;

      const flashcardList: Flashcard[] = [];
      studyset?.flashcardList.forEach((flashcard) => {
        const card: Flashcard = {
          id: flashcard.id,
          term: flashcard.term,
          definition: flashcard.definition,
        };
        flashcardList.push(card);
      });

      const response: FlashcardResponse = { flashcardList, isEnd };

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as getStudySetRouter };

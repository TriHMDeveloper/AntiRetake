import express, { NextFunction, Request, Response } from 'express';
import { LearnStatus } from '../../constants';
import { decodeToken } from '../../middlewares';
import { StudySet, User } from '../../models';
import { Flashcard, LearnSet, LearnStudySet } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

const shuffle = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};
// TODO: handle authorize
router.get(
  '/api/sets/:id/learn',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studySetId = req.params.id;

      if (req.currentUser) {
        const currentUser = await User.findOne({
          uid: req.currentUser?.uid,
        });
        const currentUserId = currentUser?.id;

        const isLearned =
          (await User.count({
            $and: [
              { _id: currentUserId },
              { learnList: { $elemMatch: { studySetId: studySetId } } },
            ],
          })) > 0;

        if (!isLearned) {
          const currentStudySet = await StudySet.findById(studySetId).populate({
            path: 'flashcardList',
          });

          const flashcardList = currentStudySet?.flashcardList.map(
            (flashcard) => {
              return {
                flashcardId: flashcard,
                status: LearnStatus.NOT_LEARNED,
              };
            }
          ) as any[];

          await User.findByIdAndUpdate(currentUserId, {
            $push: {
              learnList: {
                studySetId: studySetId,
                flashcardList: shuffle(flashcardList),
              },
            },
          });
        }

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
        const flashcardList = learnSet.flashcardList
          .filter((flashcard) => flashcard.status === LearnStatus.NOT_LEARNED)
          .map((flashcard) => {
            return {
              id: flashcard.flashcardId.id,
              term: flashcard.flashcardId.term,
              definition: flashcard.flashcardId.definition,
              status: flashcard.status,
            };
          });

        const termList = learnSet.flashcardList.map((flashcard) => {
          return flashcard.flashcardId.term;
        });

        const definitionList = learnSet.flashcardList.map((flashcard) => {
          return flashcard.flashcardId.definition;
        });

        if (flashcardList.length === 0) {
          flashcardList.push({
            id: '',
            term: '',
            definition: '',
            status: LearnStatus.LEARNED,
          });
        }
        const response: LearnStudySet = {
          studySetId: learnSet?.studySetId.id,
          flashcardList: flashcardList,
          numOfFlashcards: learnSet.flashcardList.length,
          termList: termList,
          definitionList: definitionList,
        };
        res.status(200).send(response);
      } else {
        const currentStudySet = await StudySet.findById(studySetId).populate({
          path: 'flashcardList',
        });

        const flashcardList = currentStudySet?.flashcardList.map(
          (flashcard) => {
            return {
              flashcardId: flashcard,
              status: LearnStatus.NOT_LEARNED,
            };
          }
        ) as any[];
        const shuffleFlashcardList = shuffle(flashcardList).map((flashcard) => {
          return {
            id: flashcard.flashcardId.id,
            term: flashcard.flashcardId.term,
            definition: flashcard.flashcardId.definition,
            status: flashcard.status,
          };
        });
        const termList = shuffleFlashcardList.map((flashcard) => {
          return flashcard.term;
        });

        const definitionList = shuffleFlashcardList.map((flashcard) => {
          return flashcard.definition;
        });
        const response: LearnStudySet = {
          studySetId: studySetId,
          flashcardList: shuffleFlashcardList,
          numOfFlashcards: flashcardList.length,
          termList: termList,
          definitionList: definitionList,
        };
        res.status(200).send(response);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as learnStudySetRouter };

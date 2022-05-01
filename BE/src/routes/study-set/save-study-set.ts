import express, { NextFunction, Request, Response } from 'express';
import { AccessModifier } from '../../constants';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { Folder, StudySet, User } from '../../models';
import {
  FlashcardDoc,
  SaveStudySetRequest,
  SubjectDoc,
  TextbookDoc,
} from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

const isNameDuplicated = async (
  studySetName: string,
  ownerId: string,
  folderId?: string
): Promise<boolean> => {
  const studySetLength = folderId
    ? (
        await Folder.findById(folderId).populate({
          path: 'studySetList',
          select: 'name',
          match: { name: studySetName },
        })
      )?.studySetList.length ?? 0
    : (
        await User.findById(ownerId).populate({
          path: 'studySetList',
          select: 'name',
          match: { name: studySetName },
        })
      )?.studySetList.length ?? 0;

  return studySetLength > 0;
};

router.post(
  '/api/sets/:id/save',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const currentUser = req.currentUser;
      const user = await User.findOne({ uid: currentUser?.uid });

      const studySetId = req.params.id;

      const request: SaveStudySetRequest = req.body;

      let clonedStudySetId = '';

      const isDup = await isNameDuplicated(
        request.name,
        user?.id,
        request.folderId
      );
      if (isDup) {
        throw new BadRequestError('Name duplicated or cloned');
      } else {
        const studySet = await StudySet.findById(studySetId)
          .populate({
            path: 'textbook',
            select: 'name',
          })
          .populate({
            path: 'subject',
            select: 'name',
          })
          .populate({
            path: 'flashcardList',
          });

        const cloneStudySet = StudySet.build({
          name: request.name,
          description: studySet?.description as string,
          accessModifier: AccessModifier.PRIVATE,
          owner: user!,
          subject: studySet?.subject as SubjectDoc,
          textbook: studySet?.textbook as TextbookDoc,
          // need clone flashcard?
          flashcardList: studySet?.flashcardList as FlashcardDoc[],
          rateList: [],
          clonedFromStudySet: studySet?.id,
        });
        await cloneStudySet.save();
        clonedStudySetId = cloneStudySet.id;
        await User.findByIdAndUpdate(user?.id, {
          $push: {
            studySetList: clonedStudySetId,
          },
        });
      }

      if (request.folderId) {
        await Folder.findByIdAndUpdate(request.folderId, {
          $push: {
            studySetList: clonedStudySetId,
          },
        });
      }

      res.status(201).send('Successfully');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as saveStudySetRouter };

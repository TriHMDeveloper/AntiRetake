import express, { NextFunction, Request, Response } from 'express';
import { AccessModifier } from '../../constants';
import { BadRequestError } from '../../errors';
import { Class } from '../../models';
import { ClassInfoGuest } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/classes/:id/info/guest',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const classId = req.params.id;
      const klass = await Class.findById(classId)
        .populate({
          path: 'school',
          select: 'name',
        })
        .populate({ path: 'folderList', select: 'studySetList' })
        .populate({ path: 'owner', select: ['username', 'uid'] })
        .populate({ path: 'memberList', select: ['member', 'role'] })
        .populate({ path: 'joinRequestList', select: 'requestedBy' })
        .catch((error) => {
          throw new BadRequestError('Class is not exist !');
        });

      const numOfSets = klass?.folderList
        .map((folder) => folder.studySetList.length)
        .reduce((pre, cur) => pre + cur, klass.studySetList.length);

      const response: ClassInfoGuest = {
        id: klass?.id,
        name: klass?.name as string,
        description: klass?.description as string,
        inviteLink: klass?.inviteLink as string,
        school: klass?.school as { id: string; name: string },
        owner: {
          uid: klass?.owner.uid as string,
          name: klass?.owner.username as string,
        },
        numOfSets: numOfSets as number,
        numOfMember: klass?.memberList.length as number,
        accessModifier: klass?.accessModifier ?? AccessModifier.PRIVATE,
      };
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as getClassInfoGuestRouter };

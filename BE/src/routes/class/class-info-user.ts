import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { AccessModifier, ClassRole, UserClassRole } from '../../constants';
import { BadRequestError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { Class, User } from '../../models';
import { ClassInfoUser } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

const userClassRole = (
  currentUid: string,
  memberList: Map<string, ClassRole>,
  joinRequestList: string[],
  inviteList: string[],
  ownerId: string
): UserClassRole => {
  if (currentUid === ownerId) {
    return UserClassRole.OWNER;
  }

  if (memberList.has(currentUid)) {
    return memberList.get(currentUid) === ClassRole.EDITOR
      ? UserClassRole.EDITOR
      : UserClassRole.VIEWER;
  }

  if (joinRequestList.includes(currentUid)) {
    return UserClassRole.SENT_GUEST;
  }

  if (inviteList.includes(currentUid)) {
    return UserClassRole.INVITED_GUEST;
  }

  return UserClassRole.GUEST;
};

router.get(
  '/api/classes/:id/info',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const classId = req.params.id;
      const currentUid = req.currentUser?.uid;
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

      const memberList = new Map<string, ClassRole>(
        klass?.memberList.map(
          (member) =>
            [member.member._id.toString(), member.role] as [string, ClassRole]
        )
      );

      const joinRequestList = klass?.joinRequestList.map((request) =>
        request.requestedBy._id.toString()
      );

      const inviteList = klass?.inviteList.map((invitation) =>
        invitation.inviteTo._id.toString()
      );

      const userId = (await User.findOne({ uid: currentUid }))?.id;
      const ownerId = klass?.owner.id;

      const response: ClassInfoUser = {
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
        currentUserRole: userClassRole(
          userId as string,
          memberList,
          joinRequestList as string[],
          inviteList as string[],
          ownerId as string
        ),
      };
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as getClassInfoRouter };

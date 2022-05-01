import express, { NextFunction, Request, Response } from 'express';
import { Class } from '../../models';
import { MemberCard } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/classes/:classId/members',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentClass = await Class.findById(req.params.classId).populate({
        path: 'memberList.member',
        select: ['email', 'username', 'avatarUrl'],
      });

      const memberCardList: MemberCard[] = [];
      currentClass?.memberList.forEach((item) => {
        const member = item.member;

        const card: MemberCard = {
          id: member.id as string,
          email: member.email as string,
          name: member.username as string,
          avatarUrl: member.avatarUrl as string,
          accessDay: item.joinedAt.toLocaleDateString('vi'),
          role: item.role,
        };
        memberCardList.push(card);
      });

      res.status(200).send(memberCardList);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as getMemberbyClassIDRouter };

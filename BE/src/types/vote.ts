import { VoteType } from '../constants';
import { UserDoc } from './user';

export interface Vote {
  votedBy: UserDoc;
  type: VoteType;
  votedAt: Date;
}

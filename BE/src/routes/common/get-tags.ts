import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { TagType } from '../../constants';
import { School, Subject, Textbook } from '../../models';
import {
  SchoolDoc,
  SubjectDoc,
  Tag,
  TagRequest,
  TagResponse,
  TextbookDoc,
} from '../../types';

const modelToTagList = (
  model: TextbookDoc[] | SubjectDoc[] | SchoolDoc[],
  tagType: TagType
): Tag[] => {
  const tagList: Tag[] = model.map(({ id, name }) => {
    return {
      id: id,
      name: name,
      type: tagType,
    };
  });
  return tagList;
};

// eslint-disable-next-line new-cap
const router = express.Router();
router.post(
  '/api/common/tags',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      const limit = 15;
      const tagRequest: TagRequest = req.body;
      let tagList: Tag[] = [];
      const ids = new Set();

      if (tagRequest.tagTypeList.includes(TagType.TEXTBOOK)) {
        const textbookList = await Textbook.find({
          name: { $regex: new RegExp(searchText, 'i') },
        })
          .sort({ name: 1 })
          .limit(limit);
        const textbookTagList: Tag[] = modelToTagList(
          textbookList,
          TagType.TEXTBOOK
        );
        tagList = [
          ...tagList,
          ...textbookTagList.filter((tag) => !ids.has(tag.id)),
        ];
        textbookTagList.forEach((tag) => ids.add(tag.id));
      }

      if (tagRequest.tagTypeList.includes(TagType.SUBJECT)) {
        const subjectList = await Subject.find({
          name: { $regex: new RegExp(searchText, 'i') },
        })
          .sort({ name: 1 })
          .limit(limit);
        const subjectTagList: Tag[] = modelToTagList(
          subjectList,
          TagType.SUBJECT
        );
        tagList = [
          ...tagList,
          ...subjectTagList.filter((tag) => !ids.has(tag.id)),
        ];
        subjectTagList.forEach((tag) => ids.add(tag.id));
      }

      if (tagRequest.tagTypeList.includes(TagType.SCHOOL)) {
        const schoolList = await School.find({
          name: { $regex: new RegExp(searchText, 'i') },
        })
          .sort({ name: 1 })
          .limit(limit);
        const schoolTagList: Tag[] = modelToTagList(schoolList, TagType.SCHOOL);
        tagList = [
          ...tagList,
          ...schoolTagList.filter((tag) => !ids.has(tag.id)),
        ];
        schoolTagList.forEach((tag) => ids.add(tag.id));
      }

      if (tagRequest.textbook) {
        const textbookList = await Textbook.find({
          _id: {
            $in: tagRequest.textbook.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        });
        const textbookTagList: Tag[] = modelToTagList(
          textbookList,
          TagType.TEXTBOOK
        );
        tagList = [
          ...tagList,
          ...textbookTagList.filter((tag) => !ids.has(tag.id)),
        ];
        textbookTagList.forEach((tag) => ids.add(tag.id));
      }

      if (tagRequest.subject) {
        const subjectList = await Subject.find({
          _id: {
            $in: tagRequest.subject.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        });
        const subjectTagList: Tag[] = modelToTagList(
          subjectList,
          TagType.SUBJECT
        );
        tagList = [
          ...tagList,
          ...subjectTagList.filter((tag) => !ids.has(tag.id)),
        ];
        subjectTagList.forEach((tag) => ids.add(tag.id));
      }

      if (tagRequest.school) {
        const schoolList = await School.find({
          _id: {
            $in: tagRequest.school.map((id) => new mongoose.Types.ObjectId(id)),
          },
        });
        const schoolTagList: Tag[] = modelToTagList(schoolList, TagType.SCHOOL);
        tagList = [
          ...tagList,
          ...schoolTagList.filter((tag) => !ids.has(tag.id)),
        ];
        schoolTagList.forEach((tag) => ids.add(tag.id));
      }
      tagList.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

      const response: TagResponse = {
        tagList: tagList.filter((tag) => tag.name.length > 0),
      };
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as getTagsRouter };

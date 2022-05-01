import { SortBy, TagType } from '../constants';

export type FilterRequest = {
  [tag in TagType]: string[];
};

export type TagRequest = {
  [tag in TagType]: string[];
} & {
  tagTypeList: TagType[];
};

export interface Tag {
  id: string;
  name: string;
  type: string;
}

export interface TagResponse {
  tagList: Tag[];
}

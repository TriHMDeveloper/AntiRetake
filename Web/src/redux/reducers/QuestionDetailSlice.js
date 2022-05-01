import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import questionApi from '../../api/questionApi';

export const getQUestionDetail = createAsyncThunk('forum/questionDetail', async (id) => {
  const response = await questionApi.viewQuestionDetail(id);
  return response;
});

const questionDetailSlice = createSlice({
  name: 'forum',
  initialState: {
    isError: false,
    questionDetail: {},
  },
  reducers: {
    upVote: (state, action) => {
      state.questionDetail.voteList.push(action.payload);
      state.questionDetail.numOfUpvotes = state.questionDetail.numOfUpvotes + 1;
    },
    downVote: (state, action) => {
      state.questionDetail.voteList.push(action.payload);
      state.questionDetail.numOfDownvotes = state.questionDetail.numOfDownvotes + 1;
    },
    deleteUpVote: (state, action) => {
      state.questionDetail.numOfUpvotes = state.questionDetail.numOfUpvotes - 1;
      state.questionDetail.voteList = state.questionDetail.voteList.filter((vote) => {
        return vote.votedBy !== action.payload;
      });
    },
    deleteDownVote: (state, action) => {
      state.questionDetail.numOfDownvotes = state.questionDetail.numOfDownvotes - 1;
      state.questionDetail.voteList = state.questionDetail.voteList.filter((vote) => {
        return vote.votedBy !== action.payload;
      });
    },

    upVoteComment: (state, action) => {
      state.questionDetail.commentList.forEach((element) => {
        if (element.id === action.payload.commentId) {
          element.voteList.push(action.payload.vote);
          element.numOfUpvotes = element.numOfUpvotes + 1;
        } else {
          element.commentList.forEach((childElement) => {
            if (childElement.id === action.payload.commentId) {
              childElement.voteList.push(action.payload.vote);
              childElement.numOfUpvotes = childElement.numOfUpvotes + 1;
            }
          });
        }
      });
    },
    downVoteComment: (state, action) => {
      state.questionDetail.commentList.forEach((element) => {
        if (element.id === action.payload.commentId) {
          element.voteList.push(action.payload.vote);
          element.numOfDownvotes = element.numOfDownvotes + 1;
        } else {
          element.commentList.forEach((childElement) => {
            if (childElement.id === action.payload.commentId) {
              childElement.voteList.push(action.payload.vote);
              childElement.numOfDownvotes = childElement.numOfDownvotes + 1;
            }
          });
        }
      });
    },

    deleteDownVoteComment: (state, action) => {
      state.questionDetail.commentList.forEach((element) => {
        if (element.id === action.payload.commentId) {
          element.numOfDownvotes = element.numOfDownvotes - 1;
          element.voteList = element.voteList.filter((vote) => {
            return vote.userId !== action.payload.userId;
          });
        } else {
          element.commentList.forEach((childElement) => {
            if (childElement.id === action.payload.commentId) {
              childElement.numOfDownvotes = childElement.numOfDownvotes - 1;
              childElement.voteList = childElement.voteList.filter((vote) => {
                return vote.userId !== action.payload.userId;
              });
            }
          });
        }
      });
    },

    deleteUpVoteComment: (state, action) => {
      state.questionDetail.commentList.forEach((element) => {
        if (element.id === action.payload.commentId) {
          element.numOfUpvotes = element.numOfUpvotes - 1;
          element.voteList = element.voteList.filter((vote) => {
            return vote.userId !== action.payload.userId;
          });
        } else {
          element.commentList.forEach((childElement) => {
            if (childElement.id === action.payload.commentId) {
              childElement.numOfUpvotes = childElement.numOfUpvotes - 1;
              childElement.voteList = childElement.voteList.filter((vote) => {
                return vote.userId !== action.payload.userId;
              });
            }
          });
        }
      });
    },
    editComment: (state, action) => {
      state.questionDetail.commentList.forEach((element) => {
        if (element.id === action.payload.commentId) {
          element.content = action.payload.content;
        } else {
          element.commentList.forEach((childElement) => {
            if (childElement.id === action.payload.commentId) {
              childElement.content = action.payload.content;
            }
          });
        }
      });
    },
    addCommentLevel1: (state, action) => {
      state.questionDetail.commentList.unshift(action.payload);
      state.questionDetail.numOfComments = state.questionDetail.numOfComments + 1;
    },
    addCommentLevel2: (state, action) => {
      state.questionDetail.numOfComments = state.questionDetail.numOfComments + 1;

      state.questionDetail.commentList.forEach((element) => {
        if (action.payload.replyToComment !== '') {
          if (element.id === action.payload.replyToComment) {
            element.commentList.push(action.payload.newComment);
          }
        } else {
          if (element.id === action.payload.commentId) {
            element.commentList.push(action.payload.newComment);
          }
        }
      });
    },
    deleteComment: (state, action) => {
      if (action.payload.replyToComment === '') {
        state.questionDetail.commentList.forEach((element) => {
          if (element.id === action.payload.deleteId) {
            state.questionDetail.numOfComments = state.questionDetail.numOfComments - element.commentList.length - 1;
          }
        });
        state.questionDetail.commentList = state.questionDetail.commentList.filter((comment) => {
          return comment.id !== action.payload.deleteId;
        });
      } else {
        state.questionDetail.commentList.forEach((element) => {
          if (element.id === action.payload.replyToComment) {
            state.questionDetail.numOfComments = state.questionDetail.numOfComments - 1;
            element.commentList = element.commentList.filter((comment) => {
              return comment.id !== action.payload.deleteId;
            });
          }
        });
      }
    },
    resetQuestion: (state, action) => {
      state.questionDetail = action.payload;
    },
  },
  extraReducers: {
    [getQUestionDetail.pending]: (state, action) => {
      state.questionDetail = {};
      state.isError = false;
    },
    [getQUestionDetail.fulfilled]: (state, action) => {
      state.questionDetail = action.payload;
    },
    [getQUestionDetail.rejected]: (state, action) => {
      state.isError = true;
    },
  },
});

const questionDetailReducer = questionDetailSlice.reducer;

export const {
  upVote,
  downVote,
  deleteUpVote,
  deleteDownVote,
  upVoteComment,
  downVoteComment,
  deleteDownVoteComment,
  deleteUpVoteComment,
  editComment,
  addCommentLevel1,
  addCommentLevel2,
  deleteComment,
  resetQuestion,
} = questionDetailSlice.actions;
export default questionDetailReducer;

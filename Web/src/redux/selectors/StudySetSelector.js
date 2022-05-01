export const studySetInfoSelector = (state) => state.studySetReducer.studySetInfo;
export const flashcardSelector = (state) => state.studySetReducer.allFlashcard;
export const recommendFlashcardSelector = (state) => state.studySetReducer.recommendFlashcard;
export const isLoadingFlashcardSelector = (state) => state.studySetReducer.isLoading;
export const isErrorFlashcardSelector = (state) => state.studySetReducer.isError;
export const isEndFlashcardSelector = (state) => state.studySetReducer.isEnd;

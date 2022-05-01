export const TagType = {
  SUBJECT: 'subject',
  TEXTBOOK: 'textbook',
  SCHOOL: 'school',
};

export const SortBy = {
  STAR: 'star',
  DATE: 'date',
  OLDDATE: 'olddate',
  ALPHABET: 'alphabet',
  VOTE: 'vote',
};

export const ToastType = {
  SUCCESS: 'success',
  ERROR: 'error',
};

export const AuthAction = {
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
};

export const ResponseJoinRequestType = {
  ACCEPT: 'accept',
  DECLINE: 'decline',
};

export const Default = {
  AVATAR_URL:
    'https://firebasestorage.googleapis.com/v0/b/anti-retake-user-mcs.appspot.com/o/avatar%2Favt_default.png?alt=media&token=a8e82f42-2769-419a-8eb2-3f3fd8b097bf',
};

export const ViewStudySetType = {
  USER: 'user',
  CLASS: 'class',
  FOLDER: 'folder',
};

export const UserClassRole = {
  OWNER: 'owner',
  VIEWER: 'viewer',
  EDITOR: 'editor',
  SENT_GUEST: 'sent-guest',
  GUEST: 'guest',
  INVITED_GUEST: 'invited-guest',
};

export const NotiType = {
  CLASS: 'class',
  FORUM: 'forum',
};

export const TabBarType = {
  SEARCH: [
    { href: () => '/search/sets', name: 'Study Sets' },
    { href: () => '/search/classes', name: 'Classes' },
    { href: () => '/search/users', name: 'Users' },
    { href: () => '/search/questions', name: 'Questions' },
  ],
  USER: [
    { href: (id) => `/users/${id}/sets`, name: 'Study Sets' },
    { href: (id) => `/users/${id}/folders`, name: 'Folders' },
    { href: (id) => `/users/${id}/classes`, name: 'Classes' },
    { href: (id) => `/users/${id}/questions`, name: 'Questions' },
  ],
  CLASS: [
    { href: (id) => `/classes/${id}/sets`, name: 'Study Sets' },
    { href: (id) => `/classes/${id}/folders`, name: 'Folders' },
    { href: (id) => `/classes/${id}/members`, name: 'Members' },
  ],
  CLASS_OWNER: [
    { href: (id) => `/classes/${id}/sets`, name: 'Study Sets' },
    { href: (id) => `/classes/${id}/folders`, name: 'Folders' },
    { href: (id) => `/classes/${id}/members`, name: 'Members' },
    { href: (id) => `/classes/${id}/requests`, name: 'Requests' },
  ],
};

export const ScreenLink = {
  LANDING: '/',
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  FORGOT_PASSWORD: '/forgot-password',
  CHECK_EMAIL: '/check-email',
  HOMEPAGE: '/homepage',
  CHANGE_PASSWORD: '/change-password',
  SEARCH: 'search/*',
  VIEW_USER_PROFILE: '/users/:userId/*',
  VIEW_CLASS: '/classes/:classId/*',
  VIEW_FOLDER: '/folders/:folderId/*',
  VIEW_STUDY_SET: '/sets/:studySetId',
  LEARN_STUDY_SET: '/sets/:studySetId/learn',
  CREATE_CLASS: '/create-class',
  EDIT_CLASS: '/classes/:classId/edit',
  CREATE_FOLDER: '/create-folder',
  EDIT_FOLDER: '/folders/:folderId/edit',
  CREATE_STUDY_SET: '/create-set',
  EDIT_STUDY_SET: '/sets/:studySetId/edit',
  FORUM: '/forum',
  VIEW_QUESTION: '/forum/:questionId',
  CREATE_QUESTION: '/forum/create-question',
  EDIT_QUESTION: '/forum/:questionId/edit',
  AUTH_ACTION: '/auth/action',
  RESET_PASSWORD: '/auth/action/reset',
};

/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line

const boldText = (text) => {
  // eslint-disable-next-line react/react-in-jsx-scope
  return <b>{text}</b>;
};

export const Messages = {
  MSG01: 'User name or password is incorrect.',
  MSG02: 'Password is not match.',
  MSG03: 'Password is  incorrect.',
  MSG04: 'Password must be at least 8 characters, includes at least 1 letter and 1 number ',
  MSG05: 'The new password must be different from the old password',
  MSG06: 'No result',
  MSG07: 'Create study set successfully !!!',
  MSG08: 'Create class successfully !!!',
  MSG09: 'Create folder successfully !!!',
  MSG10: 'Create question successfully !!!',
  MSG11: 'Delete study set successfully !!!',
  MSG12: 'Delete class successfully !!!',
  MSG13: 'Delete folder successfully !!!',
  MSG14: 'Delete question successfully !!!',
  MSG15: 'Update study set successfully !!!',
  MSG16: 'Update class successfully !!!',
  MSG17: 'Update folder successfully !!!',
  MSG18: 'Update question successfully !!!',
  mSG19: (className) => <p>Do you really want to delete {boldText(className)}? This process cannot be undone</p>,
  mSG20: (studySetName) => <p>Do you really want to delete {boldText(studySetName)}? This process cannot be undone</p>,
  mSG21: (folderName) => <p>Do you really want to delete {boldText(folderName)}? This process cannot be undone</p>,
  MSG22: 'Do you really want to delete this question? This process cannot be undone',
  MSG23: 'A required filed is missing. Please fill out all required field',
  MSG24: 'This class is private, you must join to see all study set',
  mSG25: (email) => (
    <p>
      We&apos;ve sent an email to {boldText(email)}
      <br /> Please check your email and click the link to continue.
    </p>
  ),
  MSG26: 'The study set name is already used',
  mSG27: (className) => <p>Do you really want to quit {boldText(className)}? This process cannot be undone</p>,
  MSG28: 'Something when wrong !!! Check your internet connection.',
  MSG29: 'Change avatar successfully !!!',
  MSG30: 'Change avatar fail !!!',
  MSG31: 'This is not an image file !!!',
  MSG32: 'Send verify email successfully !!!',
  MSG33: 'Rate study set successfully !!!',
  MSG34: 'Change name successfully !!!',
  mSG35: (studySetName) => (
    <p>Do you really want to remove {boldText(studySetName)} from class? This process cannot be undone</p>
  ),

  MSG36: 'Remove study set from class successfully !!!',
  MSG37: 'Remove folder from class successfully !!!',
  MSG38: 'Remove study set from folder successfully !!!',
  MSG39: 'Save study set successfully !!!',
  MSG40: 'Save flashcard successfully !!!',
  MSG41: 'Add study set successfully !!!',
  mSG42: (studySetName) => (
    <p>Do you really want to remove {boldText(studySetName)} from folder? This process cannot be undone</p>
  ),
  MSG43: 'Send join request successfully !!!',
  MSG44: 'Delete class successfully !!!',
  MSG45: 'Copied !!!',
  MSG46: 'Change password successfully !!!',
  MSG47: 'Send reset password email successfully !!!',
  MSG48: 'Send reset password email fail !!!',
  MSG49: 'Send verify email fail !!!',
  mSG50: (className) => <p>Do you really want to leave {boldText(className)}</p>,
  MSG51: 'Leave class successfully !!!',
  MSG52: 'Add folder successfully !!!',
  MSG53: 'Invite successfully !!!',
  MSG54: 'Invalid action code !!!',
};

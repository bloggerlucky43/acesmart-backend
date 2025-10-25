export const generateStudentID = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  return `ACE${year}${randomNum}`;
};

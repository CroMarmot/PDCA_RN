export const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = `0${date.getMonth() + 1}`.substr(-2);
  const dd = `0${date.getDate()}`.substr(-2);
  return `${yyyy}-${mm}-${dd}`;
};

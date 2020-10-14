export const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = `0${date.getMonth() + 1}`.substr(-2);
  const dd = `0${date.getDate()}`.substr(-2);
  return `${yyyy}-${mm}-${dd}`;
};

function zeroInt(n){
  return `0${n}`.substr(-2);
}

export const formatTime = (time) => {
  return `${zeroInt((time - (time % 60)) / 60)}:${zeroInt(time % 60)}`;
};

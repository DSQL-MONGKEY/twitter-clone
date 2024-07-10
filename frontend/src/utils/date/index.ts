export const formatPostDate = (createdAt) => {
   const currentDate = new Date();
   const createdAtDate = new Date(createdAt);

   const timeDiffrenceInSecond = Math.floor((currentDate - createdAt) / 1000);
   const timeDiffrenceInMinutes = Math.floor(timeDiffrenceInSecond / 60);
   const timeDiffrenceInHours = Math.floor(timeDiffrenceInMinutes / 60);
   const timeDiffrenceInDays = Math.floor(timeDiffrenceInHours / 24);

   if(timeDiffrenceInDays > 1) {
      return createdAtDate.toLocaleDateString('id-ID', { 'month': 'short', 'day': 'numeric' })
   } else if(timeDiffrenceInDays === 1) {
      return '1d';
   } else if(timeDiffrenceInHours >= 1) {
      return `${timeDiffrenceInHours}h`;
   } else if(timeDiffrenceInMinutes >= 1) {
      return `${timeDiffrenceInMinutes}min`;
   } else {
      return 'Just now'
   }
}

export const formatMemberSinceDate = (createdAt) => {
   const date = new Date(createdAt);
   const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
   const month = months[date.getMonth()];
   const year = date.getFullYear();
   return `Joined ${month} ${year}`;
}
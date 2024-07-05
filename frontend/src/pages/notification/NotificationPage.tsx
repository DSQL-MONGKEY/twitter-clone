import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";


const NotificationPage = () => {
   const isLoading = false;
	const notifications = [
		{
			_id: "1",
			from: {
				_id: "1",
				username: "johndoe",
				profileImg: "/avatars/boy2.png",
			},
			type: "follow",
		},
		{
			_id: "2",
			from: {
				_id: "2",
				username: "janedoe",
				profileImg: "/avatars/girl1.png",
			},
			type: "like",
		},
	];

	const deleteNotifications = () => {
		alert("All notifications deleted");
	};

   return (
      <div>NotificationPage</div>
   )
}

export default NotificationPage
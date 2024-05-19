import { FaTh, FaRegChartBar, FaCommentAlt } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { IoPeople } from "react-icons/io5";
import { MdRestaurantMenu, MdTableRestaurant  } from "react-icons/md";

const menu = [
  {
    title: "Dashboard",
    icon: <FaTh />,
    path: "/dashboard",
  },
  {
    title: "Add Menu Item",
    icon: <BiImageAdd />,
    path: "/add-product",
  },
  {
    title: "Orders",
    icon: <MdRestaurantMenu />,
    path: "/order",
  },
  {
    title: "Tables",
    icon: <MdTableRestaurant />,
    path: "/table",
  },
  {
    title: "Staff",
    icon: <IoPeople  />,
    path: "/staff",
  },
  {
    title: "Account",
    icon: <FaRegChartBar />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
      },
      {
        title: "Edit Profile",
        path: "/edit-profile",
      },
    ],
  },
  {
    title: "Report Bug",
    icon: <FaCommentAlt />,
    path: "/contact-us",
  },
];

export default menu;
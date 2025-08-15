import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import { RiEditBoxLine } from "react-icons/ri";
import { formattedDate } from "../../../utils/dateFormatter";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-0">
      <h1 className="mb-8 sm:mb-14 text-2xl sm:text-3xl font-medium text-richblack-5 text-center sm:text-left">
        My Profile
      </h1>

      {/* Section 1 */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 sm:gap-0 rounded-md border border-richblack-700 bg-richblack-800 p-6 sm:p-8 sm:px-12">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img
            src={user?.image}
            alt={`profile-${user?.firstname}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-richblack-5">
              {user?.firstname + " " + user?.lastname}
            </p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text="Edit"
          onClick={() => {
            navigate("/dashboard/settings");
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* Section 2 - About */}
      <div className="my-6 sm:my-10 flex flex-col gap-y-6 sm:gap-y-10 rounded-md border border-richblack-700 bg-richblack-800 p-6 sm:p-8 sm:px-12">
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4 sm:gap-0">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <IconBtn
            text="Edit"
            onClick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
          } text-sm font-medium`}
        >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>

      {/* Section 3 - Personal Details */}
      <div className="my-6 sm:my-10 flex flex-col gap-y-6 sm:gap-y-10 rounded-md border border-richblack-700 bg-richblack-800 p-6 sm:p-8 sm:px-12">
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4 sm:gap-0">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onClick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="flex flex-col sm:flex-row w-full max-w-full sm:max-w-[500px] justify-between gap-6 sm:gap-0">
          <div className="flex flex-col gap-y-5 w-full sm:w-auto">
            <div>
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstname}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5 w-full sm:w-auto">
            <div>
              <p className="mb-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastname}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
              <p className="text-sm font-medium text-richblack-5">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";
import CoursesTable from "./InstructorCourses/CoursesTable";

export const MyCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      console.log("Token in MyCourses:", token); //  Add this
      const result = await fetchInstructorCourses(token);
      console.log("Fetched Courses from API:", result); //  Add this

      if (result) {
        setCourses(result);
      }
    };

    if (token) {
      fetchCourses(); //  Call only if token is available
    }
  }, [token]); //  token should be a dependency

  return (
    <div className="my-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Courses</h1>
        <IconBtn text="Add Course" onClick={() => navigate("/dashboard/add-course")} />
      </div>

      {courses.length > 0 ? (
        <CoursesTable courses={courses} setCourses={setCourses} />
      ) : (
        <p className="text-richblack-200">You haven’t created any courses yet.</p>
      )}
    </div>
  );
};

export default MyCourses;

import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import OpenRoute from "./components/core/Auth/OpenRoute";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./components/core/dashboard/MyProfile";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import Settings from "./components/core/dashboard/settings";
import EnrolledCourses from "./components/core/dashboard/EnrolledCourses";
import Cart from "./components/core/dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import AddCourse from "./components/core/dashboard/AddCourse";
import MyCourses from "./components/core/dashboard/MyCourses";
import EditCourse from "./components/core/dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/dashboard/InstructorDashboard/Instructor";

function App() {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.profile)
  return (
<div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
<Navbar/>
  <Routes>
    <Route path="/" element={<Home/>}></Route>
    <Route path="/catalog/:catalogName" element={<Catalog/>}></Route>
    <Route path="courses/:courseId" element={<CourseDetails/>} />
    <Route path="/signup" element={<Signup/>}></Route>
    <Route path="/login" element={<Login/>}></Route>
    <Route
      path="/forgot-password"
      element={
        <OpenRoute>
          <ForgotPassword/>
        </OpenRoute>
      }
    />
    <Route
      path="/update-password/:id"
      element={
        <OpenRoute>
          <UpdatePassword/>
        </OpenRoute>
      }
    />
    <Route
      path="/verify-email"
      element={
        <OpenRoute>
          <VerifyEmail/>
        </OpenRoute>
      }
    />
    <Route
      path="/about"
      element={
          <About/>
      }
    />
    <Route path="/contact" element={<Contact />} />

    <Route 
    element={
      <PrivateRoute>
         <Dashboard/>
      </PrivateRoute>
    }
    >
    <Route path="/dashboard/my-profile" element={<MyProfile/>}/>
    <Route path="/dashboard/settings" element={<Settings/>}/>

    {
      user?.accountType === ACCOUNT_TYPE.STUDENT && (
        <>
        <Route path="/dashboard/cart" element={<Cart/>}/>
        <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
        </>
      )
    }

     {
      user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
        <>
        <Route path="/dashboard/instructor" element={<Instructor/>}/>
        <Route path="/dashboard/add-course" element={<AddCourse/>}/>
        <Route path="/dashboard/my-courses" element={<MyCourses/>}/>
        <Route path="/dashboard/edit-course/:courseId" element={<EditCourse/>}/>
        </>
      )
    }
    

    </Route>
    <Route element={
      <PrivateRoute>
      <ViewCourse/>
      </PrivateRoute>
    }>
    {
      user?.accountType === ACCOUNT_TYPE.STUDENT && (
        <Route 
          path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
          element={<VideoDetails/>}
        />
      )
    }

    </Route>

    <Route path="*" element={<Error />} />

  </Routes>
</div>
  );
}
export default App;

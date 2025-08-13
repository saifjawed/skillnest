import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { FreeMode, Pagination, Autoplay, Navigation } from "swiper/modules"; // 

import Course_Card from "./Course_Card";

const CourseSlider = ({ courses }) => {
  return (
    <>
      {courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={courses.length > 3}
          modules={[FreeMode, Pagination, Autoplay, Navigation]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]"
        >
          {courses.map((course, index) => (
            <SwiperSlide key={index}>
              <Course_Card course={course} Height="h-[250px]" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  );
};

export default CourseSlider;

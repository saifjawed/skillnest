import React from 'react'
import HightlightText from './HightlightText';
import know_your_progress from "../../../assets/Images/Know_your_progress.png";
import comapre_with_other from "../../../assets/Images/Compare_with_others.png";
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png";
import CTAbutton from "../HomePage/Button";

 const LearningLanguageSection = () => {
  return (
    <div className="my-10">
        <div className="flex flex-col gap-5">

        <div className=" text-4xl font-semibold text-center">
            Your swiss knife for
            <HightlightText text={"learning any language"}/>
        </div>

        <div className="text-center text-richblack-600 mx-auto text-base mt-2 font-medium w-[70%]">
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0">
        <img
        src={know_your_progress}
            alt='KnowYourProgressImage'
            className="object-contain  lg:-mr-32 "
        />
        <img
        src={comapre_with_other}
            alt='KnowYourProgressImage'
            className="object-contain"
        />
        <img
        src={plan_your_lesson}
            alt='KnowYourProgressImage'
            className="object-contain  lg:-ml-36 lg:-mt-5 -mt-16"
        />
        </div>
        <div className="w-fit mx-auto lg:mb-20 mb-8 -mt-5">
           <CTAbutton active={true} linkto={"/signup"}>
            <div>
                Learn More
            </div>
           </CTAbutton>
        </div>

        </div>
    </div>
  )
}

export default LearningLanguageSection;

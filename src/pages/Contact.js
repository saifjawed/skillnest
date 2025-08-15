import React from "react"

import Footer from "../components/common/Footer";
import ContactDetails from "../components/contactPage/ContactDetails";
import ContactForm from "../components/contactPage/ContactForm";
import ReviewSlider from "../components/common/ReviewSlider";

const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
 <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white px-4">
  {/* Reviews from Other Learners */}
  <h1 className="text-center font-semibold mt-8 text-2xl sm:text-3xl md:text-4xl">
    Reviews from other learners
  </h1>
  <div className="w-full mt-4">
    <ReviewSlider />
  </div>
</div>
      <Footer />
    </div>
  )
}

export default Contact;

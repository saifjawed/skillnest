const RatingAndReviews = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");
const User = require("../models/User");


//createRating
exports.createRating = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Get data from request body
    const { rating, review, courseId } = req.body;
    console.log("Course ID:", courseId);
    console.log("User ID:", userId);

    // Find the course by ID
    const courseDetails = await Course.findById(courseId);

    // Course not found
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user is enrolled
    const isEnrolled = courseDetails.studentsEnrolled.some(
      (id) => id.toString() === userId.toString()
    );

    // If user is not enrolled
    if (!isEnrolled) {
      console.log("Student is NOT enrolled");
      return res.status(403).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    console.log("Student IS enrolled");

    // Check if user already reviewed
    const alreadyReviewed = await RatingAndReviews.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }

    // Create rating and review
    const ratingReview = await RatingAndReviews.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // Push the review ID into course's `ratingAndReviews` array (case-sensitive!)
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );

    console.log("Updated Course:", updatedCourseDetails);

    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
      ratingReview,
    });
  } catch (error) {
    console.log("Error in createRating:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAverageRating
exports.getAverageRating = async (req,res) => {
    try{
        //get course id
        const courseId = req.body.courseId;
        //calculate average rating
        const result = await RatingAndReviews.aggregate([
            {
                $match: {
                    course: mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id:null,
                    averageRating: { $avg: "$rating"},
                },
            },
        ]);

        //return rating
        if(result.length > 0) {
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            });
        }

        //if no rating review exist
        return res.status(200).json({
            success:true,
            message:'There is no Average Rating, no rating given till now',
            aveargeRating:0,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//getAllRatingAndReviews
exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReviews.find({})
      .sort({ rating: "desc" })
      .populate("user", "firstname lastname email image")
      .populate("course", "courseName")
      .exec();

    const validReviews = allReviews.filter(
      (review) => review.user && review.course
    );

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: validReviews,
    });
  } catch (error) {
    console.error("ERROR FETCHING REVIEWS:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};


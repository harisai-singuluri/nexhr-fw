import Performance from "../models/Performance.js";

// @desc    Submit employee performance appraisal evaluation
// @route   POST /api/v1/performance/reviews
export const submitReview = async (req, res) => {
  try {
    const { employeeId, reviewPeriod, rating, feedback, goals } = req.body;

    if (!employeeId || !feedback) {
      return res.status(400).json({ message: "Validation error: Employee reference and feedback are mandatory." });
    }

    // Adapt frontend flat rating structure to the underlying detailed schema parameters
    const technicalSkills = req.body.technicalSkills || rating || 5;
    const communication = req.body.communication || rating || 5;
    const delivery = req.body.delivery || rating || 5;

    const avgScore = parseFloat(((technicalSkills + communication + delivery) / 3).toFixed(2));

    const review = await Performance.create({
      employee: employeeId,
      reviewer: req.user._id,
      reviewCycle: reviewPeriod || "Q2 2026",
      ratings: { technicalSkills, communication, delivery },
      averageScore: avgScore,
      feedback,
      goals: goals || []
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Appraisal entry already registered for this employee/cycle." });
    }
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/v1/performance/reviews
// @desc    Retrieve all historical workplace evaluations 
export const getReviews = async (req, res) => {
  try {
    const reviews = await Performance.find()
      .populate("employee", "name employeeId email")
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 });

    // Transform database structures back into matching client schema structures
    const normalizedReviews = reviews.map(rev => ({
      _id: rev._id,
      employee: rev.employee,
      reviewer: rev.reviewer,
      reviewPeriod: rev.reviewCycle,
      rating: rev.averageScore, // Maps average metric cleanly onto UI representation
      feedback: rev.feedback
    }));

    res.status(200).json(normalizedReviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to sync archived appraisals.", error: error.message });
  }
};
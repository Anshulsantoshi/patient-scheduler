const IntakeForm = require('../models/formintake');

// Submit intake form
const submitIntakeForm = async (req, res) => {
  try {
    const { medicalHistory, insurance, symptoms } = req.body;

    if (!medicalHistory || !insurance || !symptoms) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newForm = new IntakeForm({
      patient: req.user.id,
      medicalHistory,
      insurance,
      symptoms
    });

    await newForm.save();

    res.status(201).json({
      success: true,
      message: "Intake form submitted successfully",
      form: newForm
    });
  } catch (error) {
    console.log("Error in submitIntakeForm:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all intake forms of a patient
const getPatientIntakeForms = async (req, res) => {
  try {
    const forms = await IntakeForm.find({ patient: req.user.id });
    res.status(200).json({ success: true, count: forms.length, forms });
  } catch (error) {
    console.log("Error in getPatientIntakeForms:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { submitIntakeForm, getPatientIntakeForms };

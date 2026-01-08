import cloudinary from "../config/cloudinary.js";
import { Student } from "../models/index.js";
import { generateStudentID } from "../utils/generateStudentID.js";

export const fetchStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const students = await Student.findAll({
      where: { teacherId },
      order: [["createdAt", "DESC"]],
    });

    return res
      .status(200)
      .json({ success: true, count: students.length, students });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const addStudent = async (req, res) => {
  try {
    const { firstName, lastName, studentEmail } = req.body;
    const teacherId = req.user.id;
    console.log("teacher id is", teacherId);

    console.log("Incoming", req.body);

    if (!firstName || !lastName || !studentEmail) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    const studentId = generateStudentID();

    await Student.create({
      firstName: firstName.trim().toLowerCase(),
      lastName: lastName.toLowerCase().trim(),
      studentId: studentId,
      studentEmail: studentEmail.trim().toLowerCase(),
      teacherId,
      faceImageUrl: req.file ? req.file.path : null,
      faceImagePublicId: req.file ? req.file.filename : null,
    });

    return res
      .status(201)
      .json({ success: true, message: "Student Added Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: true, error: "Server error" });
  }
};

export const activateStudent = async (req, res) => {
  const { studentId } = req.params;
  console.log("student id", req.params);

  try {
    const student = await Student.findOne({ where: { id: studentId } });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    student.active = true;
    await student.save();

    return res
      .status(200)
      .json({ success: true, message: "Student activated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const deactivateStudent = async (req, res) => {
  const { studentId } = req.params;
  console.log("student id", req.params);

  try {
    const student = await Student.findOne({ where: { id: studentId } });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    console.log(student);

    student.active = false;
    await student.save();

    return res
      .status(200)
      .json({ success: true, message: "Student deactivated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;
  console.log("student id", req.params);

  try {
    const student = await Student.findOne({ where: { id: studentId } });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    await student.destroy();

    return res
      .status(200)
      .json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const addStudentsBulk = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const studentsData = req.body.students;

    const studentsToInsert = studentsData.map((s) => ({
      firstName: s.firstName,
      lastName: s.lastName,
      studentId: generateStudentID(),
      teacherId,
    }));

    const students = await Student.bulkCreate(studentsToInsert);

    return res.status(201).json({
      message: "Student Uploaded Successful",
      count: students.length,
      students,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const studentLogin = async (req, res) => {
  try {
    const { firstname, studentId } = req.body;

    const student = await Student.findOne({ where: { firstname, studentId } });

    if (!student) {
      return res.status(400).json({ error: "Invalid login credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      student,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const uploadFace = async (req, res) => {
  try {
    const { id } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const user = await Student.findByPk(id);

    console.log("user ", user);

    if (req.file) {
      user.faceImageUrl = req.file.path;
      user.faceImagePublicId = req.file.filename;
      await user.save();
    }

    user.faceImageUrl = req.file.path;
    user.faceImagePublicId = req.file.filename;

    console.log("face image", user.faceImagePublicId, user.faceImageUrl);

    await user.save();

    res.json({
      message: "Face image uploaded successfully",
      faceImageUrl: user.faceImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// controller
export const getStudentFace = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOne({ where: { studentId } });

  if (!student || !student.faceImageUrl) {
    return res.status(404).json({ message: "Face not registered" });
  }

  res.json({ faceImageUrl: student.faceImageUrl });
};

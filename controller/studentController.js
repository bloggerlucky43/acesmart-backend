import { Student } from "../models/index.js";
import { generateStudentID } from "../utils/generateStudentID.js";

export const addStudent = async (req, res) => {
  try {
    const { firstName, lastName, studentemail } = req.body;
    const teacherId = req.user.id;

    console.log(req.body, teacherId);

    const studentId = generateStudentID();

    const student = await Student.create({
      firstName: firstName.trim().toLowerCase(),
      lastName: lastName.toLowerCase().trim(),
      studentId: studentId,
      studentEmail: studentemail.trim().toLowerCase(),
      teacherId,
    });

    return res.status(201).json({ message: "Student Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const addStudentsBulk = async (req, res) => {
  try {
    const teacherId = req.uer.id;
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

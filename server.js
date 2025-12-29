import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import sequelize from "./config/db.js";
import bodyParser from "body-parser";
import questionRoutes from "./routes/questionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import Question from "./models/Question.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://acesmart-backend.onrender.com",
  "https://app.acesmart.site",
];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/results", resultRoutes);
sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB connection failed:", err));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

async function importAPIQuestions(subject, year) {
  try {
    const url = `https://questions.aloc.com.ng/api/v2/q/20?subject=${subject}&year=${year}`;
    // console.log(url);

    const response = await axios.get(url, {
      headers: {
        AccessToken: `QB-d535ebf450b7934545ad`,
      },
    });
    // console.log(response);

    const data = response.data.data;

    const formattedQuestions = data.map((q) => ({
      questionText: q.question,
      options: q.option,
      correctAnswer: q.answer,
      subject: subject,
      topic: q.section,
      examYear: q.examyear,
      difficulty: q.difficulty || "medium",
      source: "api",
      imageUrl: q.image || null,
    }));
    await Question.bulkCreate(formattedQuestions, {
      ignoreDuplicates: true,
    });
    console.log(`✅ Imported ${formattedQuestions.length} questions from API`);
  } catch (error) {
    console.error(
      "❌ Error importing from ALOC:",
      error.response?.data || error.message
    );
  }
}

// importAPIQuestions("government", 2018);
// importAPIQuestions("crk", 2018);
// importAPIQuestions("currentaffairs", 2018);
// importAPIQuestions("irk", 2018);
// importAPIQuestions("history", 2018);
// importAPIQuestions("mathematics", 2018);
// importAPIQuestions("english", 2018);
// importAPIQuestions("commerce", 2018);
// importAPIQuestions("accounting", 2018);
// importAPIQuestions("biology", 2018);
// importAPIQuestions("physics", 2018);
// importAPIQuestions("chemistry", 2018);
// importAPIQuestions("englishlit", 2018);
// importAPIQuestions("economics", 2018);
// importAPIQuestions("government", 2018);
// importAPIQuestions("crk", 2018);
// importAPIQuestions("currentaffairs", 2018);
// importAPIQuestions("irk", 2018);
// importAPIQuestions("history", 2018);
// importAPIQuestions("mathematics", 2018);
// importAPIQuestions("english", 2018);
// importAPIQuestions("commerce", 2018);
// importAPIQuestions("accounting", 2018);
// importAPIQuestions("biology", 2018);
// importAPIQuestions("physics", 2018);
// importAPIQuestions("chemistry", 2018);
// importAPIQuestions("englishlit", 2018);
// importAPIQuestions("economics", 2018);

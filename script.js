import Question from "./models/Question.js";
import sequelize from "./config/db.js";
import axios from "axios";

// async function initDB() {
//   try {
//     await sequelize.authenticate();
//     console.log("✅ Database connected successfully");

//     // This will create the table if it doesn't exist
//     await Question.sync({ alter: true });
//     console.log("✅ Questions table is ready");
//   } catch (error) {
//     console.error("❌ Database error:", error);
//   }
// }

// initDB();

async function importAPIQuestions(subject, year) {
  try {
    const url = `https://questions.aloc.com.ng/api/v2/q/20?subject=${subject}&year=${year}`;
    console.log(url);

    const response = await axios.get(url, {
      headers: {
        AccessToken: `QB-d535ebf450b7934545ad`,
      },
    });
    console.log(response);

    const data = response.data.data;
    console.log(data);

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

importAPIQuestions("government", 2020);
importAPIQuestions("crk", 2020);
importAPIQuestions("currentaffairs", 2020);
importAPIQuestions("irk", 2020);
importAPIQuestions("history", 2020);
importAPIQuestions("mathematics", 2020);
importAPIQuestions("english", 2020);
importAPIQuestions("commerce", 2020);
importAPIQuestions("accounting", 2020);
importAPIQuestions("biology", 2020);
importAPIQuestions("physics", 2020);
importAPIQuestions("chemistry", 2020);
importAPIQuestions("englishlit", 2020);
importAPIQuestions("economics", 2020);

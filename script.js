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
      error.response?.data || error.message,
    );
  }
}

importAPIQuestions("government", 1990);
importAPIQuestions("crk", 1990);
importAPIQuestions("currentaffairs", 1990);
importAPIQuestions("irk", 1990);
importAPIQuestions("history", 1990);
importAPIQuestions("mathematics", 1990);
importAPIQuestions("english", 1990);
importAPIQuestions("commerce", 1990);
importAPIQuestions("accounting", 1990);
importAPIQuestions("biology", 1990);
importAPIQuestions("physics", 1990);
importAPIQuestions("chemistry", 1990);
importAPIQuestions("englishlit", 1990);
importAPIQuestions("economics", 1990);

const express = require("express");
const cors = require("cors");
const {
  GoogleGenerativeAI,
  FunctionDeclarationSchemaType,
} = require("@google/generative-ai");
const {
  GoogleAIFileManager,
  FileState,
} = require("@google/generative-ai/server");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

require("dotenv").config();
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const upload = multer({ dest: "uploads/" });

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: history || [],
      //   generationConfig: {
      //     maxOutputTokens: 100,
      //   },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.post("/generate-quiz", async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: "Data is required." });
    }

    let model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: FunctionDeclarationSchemaType.ARRAY,
          items: {
            type: FunctionDeclarationSchemaType.OBJECT,
            properties: {
              question: {
                type: FunctionDeclarationSchemaType.STRING,
              },
              answers: {
                type: FunctionDeclarationSchemaType.ARRAY,
                items: {
                  type: FunctionDeclarationSchemaType.OBJECT,
                  properties: {
                    answer: {
                      type: FunctionDeclarationSchemaType.STRING,
                    },
                    isCorrect: {
                      type: FunctionDeclarationSchemaType.BOOLEAN,
                    },
                    explanation: {
                      type: FunctionDeclarationSchemaType.STRING,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const prompt = `
        Generate a quiz with between 6 and 10 questions, each having exactly 4 answers. 
        For each answer give an explanation of why it is wrong and or correct.
        Use the following data : ${JSON.stringify(data)}
    `;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.post("/study-ai", upload.single("video"), async (req, res) => {
  const videoPath = req.file.path;

  try {
    // Upload the file and specify a display name.
    const uploadResult = await fileManager.uploadFile(path.resolve(videoPath), {
      mimeType: "video/webm",
      displayName: "AI chat",
    });

    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
      process.stdout.write(".");
      // Sleep for 10 seconds
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      // Fetch the file from the API again
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("Video processing failed.");
    }

    const model = genAI.getGenerativeModel({
      // The Gemini 1.5 models are versatile and work with multimodal prompts
      model: "gemini-1.5-flash",
    });

    // Generate content using text and the URI reference for the uploaded file.
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri,
        },
      },
      {
        text: `You are a student tutor engaging in a two-way conversation with a student. 
        Your role is to assist the student in their studies. Whenever possible, provide long clear explanations 
        and relevant examples to enhance understanding. Respond in a supportive and conversational 
        manner, ensuring the student feels comfortable and encouraged to ask further questions.
        Don't rephrase the prompt just answer the question right away.
        `,
      },
    ]);
    await fileManager.deleteFile(uploadResult.file.name);

    const text = result.response.text();
    console.log(text);
    res.json({ text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: `An error occurred. ${e}` });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

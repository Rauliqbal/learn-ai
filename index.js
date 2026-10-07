import express from "express";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";
import cors from "cors";
import morgan from "morgan";

const app = express();
const port = 3000;
const ai = new GoogleGenAI();
const upload = multer();

//* Init App
app
  .use(express.json())
  .use(cors())
  .use(morgan("dev"))

  //* Routes + Controller
  .get("/", (req, res) => {
    res.json({ message: "Hello World" });
  })

  .post("/api/generate-text", async (req, res) => {
    const { prompt } = req.body;
    const base64 = req.file?.buffer.toString("base64");

    try {
      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: prompt,
      });

      console.log(interaction.output_text);
      return res
        .json({
          status: "Success!",
          answer: interaction.output_text,
        })
        .status(200);
    } catch (error) {
      console.error(error);

      return res.json({
        status: "Failed!",
        message: `Internal server error: ${error}`,
      });
    }
  })

  .post("/api/process-media", upload.single("file"), async (req, res) => {
    const { prompt } = req.body;
    const base64 = req.file?.buffer.toString("base64");

    try {
      if (!req.file) {
        return res.status(400).json({
          status: "Failed!",
          message: "File is required",
        });
      }

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image",
            data: base64,
            mime_type: req.file.mimetype,
          },
        ],
      });
      
      return res.status(200).json({
        status: "Success!",
        answer: interaction.output_text,
      });
    } catch (error) {
      console.error(error);

      return res.json({
        status: "Failed!",
        message: `Internal server error: ${error}`,
      });
    }
  })

  .listen(port, () => {
    console.log(`Server is Running http://localhost:${port}`);
  });

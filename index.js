import express from "express";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";
import cors from "cors";
import morgan from "morgan";
import { aiConfig, model } from "./ai.config.js";
import { marked } from "marked";

const app = express();
const port = 3000;
const ai = new GoogleGenAI();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

app.set("view engine", "ejs");

app
  .use(express.json())
  .use(cors())
  .use(morgan("dev"))
  .get("/", (req, res) => {
    res.render("index");
  })

  // Generate Text
  .post("/api/generate-text", async (req, res) => {
    const prompt = req.body?.prompt?.trim();

    if (!prompt) {
      return res.status(400).json({
        status: "Failed",
        message: "Pertanyaan tidak boleh kosong.",
      });
    }

    // Definisi persona dan batasan konteks
    const systemInstruction = `
      Anda adalah seorang Software Engineer profesional. 
      Tugas Anda adalah menjawab pertanyaan teknis terkait pengembangan perangkat lunak.
      - Gunakan Bahasa Indonesia yang baku, teknis, namun mudah dipahami.
      - Jika pertanyaan di luar konteks software engineering, tolak dengan sopan dan arahkan kembali ke topik.
      - Berikan penjelasan yang terstruktur, jika perlu gunakan poin-poin atau contoh kode.
      - Tetap objektif dan berbasis pada praktik terbaik (best practices) industri.
    `;

    try {
      const interaction = await ai.interactions.create({
        model: model,
        input: prompt,
        system_instruction: systemInstruction,
        generation_config: {
          ...aiConfig.generation,
        },
      });

      // parse to Html
      const htmlContent = marked.parse(interaction.output_text);

      return res.status(200).json({
        status: "Success",
        answer: htmlContent,
      });
    } catch (error) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        status: "Failed",
        message: "Gagal mendapatkan jawaban. Silakan coba lagi.",
      });
    }
  })

  // Process Media
  .post("/api/process-media", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        status: "Failed",
        message: "File wajib diunggah.",
      });
    }

    try {
      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: [
          { type: "text", text: req.body.prompt || "Analisis file ini." },
          {
            type: "image",
            data: req.file.buffer.toString("base64"),
            mime_type: req.file.mimetype,
          },
        ],
      });

      return res.status(200).json({
        status: "Success",
        answer: interaction.output_text,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "Failed",
        message: "Gagal memproses file.",
      });
    }
  })
  .listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });

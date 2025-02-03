import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());  // Enable frontend requests
app.use(bodyParser.json({ limit: "10mb" })); // Increase request size limit

app.post("/generate-pdf", async (req, res) => {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: "No HTML content provided" });

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new", // Use "true" if "new" causes issues
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle2" });

        await page.setContent(html, { waitUntil: "domcontentloaded" });

        // Inject Tailwind styles if not included in the HTML
        await page.addStyleTag({
            url: "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
        });


        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="resume.pdf"');
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: "Failed to generate PDF" });
    } finally {
        if (browser) await browser.close(); // Ensure browser closes
    }
});


app.get('/', (req, res) => {
    res.json({ message: 'All systems normal. (Backend)' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

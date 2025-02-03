import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })) // Increased limit for larger HTML content

app.post("/generate-pdf", async (req, res) => {
    const { html } = req.body
    if (!html) return res.status(400).json({ error: "No HTML content provided" })

    let browser
    try {
        browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        })

        const page = await browser.newPage()

        // Set the content and wait for the network to be idle
        await page.setContent(html, { waitUntil: "networkidle0" })

        // Inject Tailwind CSS
        await page.addStyleTag({
        url: "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
        })

        // Wait for a short time to ensure styles are applied (using setTimeout instead of waitForTimeout)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const pdfBuffer = await page.pdf({
        margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
        printBackground: true,
        format: "A4",
        })

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", 'attachment; filename="resume.pdf"')
        res.send(pdfBuffer)
    } catch (error) {
        console.error("Error generating PDF:", error)
        res.status(500).json({ error: "Failed to generate PDF", details: error.message })
    } finally {
        if (browser) await browser.close()
    }
})

app.get("/", (req, res) => {
    res.json({ message: "PDF generation server is running." })
})

const PORT = 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))


import { type NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer-core"
import chromium from "chrome-aws-lambda";

export async function POST(req: NextRequest) {
  const { html, name } = await req.json()
    if (!html) {
        return NextResponse.json({ error: "HTML content is required" }, { status: 400 })
    }
    let userName = name || "New_Resume";
    userName = userName.replace(/\s+/g, "_"); // Replace spaces for filename safety

    const isProd = process.env.VERCEL_ENV === "production";

    let browser
    try {
        if(isProd){
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath, // Use the Lambda-compatible Chrome path
                headless: true,
            });
        } else {
            browser = await puppeteer.launch({
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            })
        }
        const page = await browser.newPage()
        // Set the viewport to match A4 size
        await page.setViewport({
            width: 794, // A4 width in pixels at 96 DPI
            height: 1123, // A4 height in pixels at 96 DPI
            deviceScaleFactor: 2, // Increase for better quality
        })
        await page.setContent(html, { waitUntil: "networkidle0" })
        await page.evaluate((name:string) => {
            document.title = `${name}'s Resume`;
        }, userName);
        const pdf = await page.pdf({ 
            margin: { top: "5mm", right: "0mm", bottom: "5mm", left: "0mm" },
            printBackground: true,
            format: "a4" 
        })
        await browser.close()

        return new NextResponse(pdf, {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${userName}_Resume.pdf`,
        },
        })
    } catch (error) {
        console.error("PDF generation error:", error)
        return NextResponse.json({ error: "PDF generation failed" }, { status: 500 })
    } finally {
        if (browser) await browser.close()
    }
}

export async function GET (){
    return NextResponse.json({
        message:"PDF generation server is running."
    })
}
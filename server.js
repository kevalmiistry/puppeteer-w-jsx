const express = require("express");
const ReactDOMServer = require("react-dom/server");
const App = require("./App.js");
const generatePDF = require("./puppeteer");

const app = express();
app.use(express.json());

app.post("/get-pdf", async (req, res) => {
    const jsx = App(req.body);
    const html = ReactDOMServer.renderToString(jsx);

    //Save & Send the rendered HTML to the client
    const htmlTemlate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&display=swap"
                rel="stylesheet"
            >
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Roboto', sans-serif;
                }
            </style>
        </head>
        <body>
            ${html}
        </body>
        </html>
    `;

    const pdf = await generatePDF(htmlTemlate);
    if (pdf) {
        res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=downloaded-file.pdf"
        });
        res.end(pdf);
    } else {
        res.status(400).json({ message: "Something went wrong" });
    }
});

const port = 3003;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

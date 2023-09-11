const express = require('express');
const puppeteer = require('puppeteer');
const jsBeautify = require('js-beautify');
const cache = require('memory-cache');

const app = express();
const port = process.env.PORT || 3131;

let browser;

(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
})();


app.get(/^(?!.*\.(pdf|css|png|jpg|jpeg|gif|ico|txt|js|svg|eot|ttf|woff|woff2|vue|tsx)$).*$/, async (req, res) => {
    let rawUrl = req.url.slice(1);

    try {
        new URL(rawUrl);
    } catch (error) {
        res.status(400).json({ error: 'Invalid URL format.' });
        return;
    }

    let cachedContent = cache.get(rawUrl);

    if (cachedContent) {
        res.set('Content-Type', 'text/html');
        res.send(cachedContent);
        return;
    }

    let page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on('request', (request) => {
        var type= request.resourceType();

        if(["stylesheet", "image", "font"].includes(type)){
            request.abort();
            return;
        }

        request.continue()
    });

    try {
        await page.goto(rawUrl, { waitUntil: 'networkidle2' });

        //await page.waitForFunction('document.fakeSSR === "complete"');

        const response = await page.evaluate(() => {
            return {
                contentType: document.contentType,
                content: document.documentElement.innerHTML
            };
        });


        let content = response.content;

        if (response.contentType == 'text/html') {
            content = jsBeautify.html_beautify(content);
        }

        cache.put(rawUrl, content, 5 * 60 * 1000); // 5 DK mq

        res.set('Content-Type', response.contentType);
        res.send(content);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });

    } finally {
        await page.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
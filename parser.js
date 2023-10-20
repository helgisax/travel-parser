const axios = require('axios');
const cheerio = require('cheerio');

class WebScraper {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async fetchHTML(url) {
        try {
            const { data } = await axios.get(url);
            return data;
        } catch (error) {
            console.error(`Failed to fetch HTML from ${url} due to ${error.message}`);
        }
    }

    async extractTourLinks() {
        const html = await this.fetchHTML(this.baseURL + "/tury");
        const $ = cheerio.load(html);
        const links = $(".hot-tour-block a")
            .map((i, el) => this.baseURL + $(el).attr("href"))
            .toArray();

        return links;
    }
}

class LinkShortener {
    constructor() {
        this.BITLY_ACCESS_TOKEN = '7a73d5102d235a8957a7dcf13ea443aeb7f843cf';
    }

    async createShortLink(longUrl) {
        const BITLY_API_URL = 'https://api-ssl.bitly.com/v4/shorten';

        try {
            const response = await axios.post(BITLY_API_URL, {
                long_url: longUrl
            }, {
                headers: {
                    'Authorization': `Bearer ${this.BITLY_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.link;
        } catch (error) {
            console.error(`Error creating short link with Bitly: ${error.message}`);
        }
    }
}

class MessageGenerator {
    constructor(baseMessage) {
        this.baseMessage = baseMessage;
    }

    generateMessages(links) {
        return links.map(link => `${this.baseMessage} ${link}`);
    }
}

async function main() {
    const scraper = new WebScraper("https://travelata.ru");
    const links = await scraper.extractTourLinks();

    const shortener = new LinkShortener();
    const shortLinks = await Promise.all(links.map(link => shortener.createShortLink(link)));

    const generator = new MessageGenerator("Миша, привет, это тестовая программа, классный пенис тут:");
    const messages = generator.generateMessages(shortLinks);

    // Здесь вы можете передать messages в ваш Telegram бот
    console.log(messages);
}

main().catch(error => {
    console.error(`Error: ${error.message}`);
});

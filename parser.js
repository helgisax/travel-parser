const axios = require('axios');
const cheerio = require('cheerio');

async function fetchHTML(url) {
  try {
      const { data } = await axios.get(url);
      return data;
  } catch (error) {
      console.error(`Failed to fetch HTML from ${url} due to ${error.message}`);
  }
}

async function extractTourLinks() {
  const url = "https://travelata.ru/tury";
  const html = await fetchHTML(url);
  const $ = cheerio.load(html);

  // Извлекаем ссылки из блоков с классом hot-tour-block
  const links = $(".hot-tour-block a").map((i, el) => $(el).attr("href")).toArray();

  return links; // Возвращаем массив ссылок.
}

// Вы можете вызвать функцию, чтобы проверить ее работу:
// extractTourLinks().then(links => console.log(links));


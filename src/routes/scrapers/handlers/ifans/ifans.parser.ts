import { getHtml } from '@src/routes/posts/common';
import { load as cheerioLoad, CheerioAPI } from 'cheerio';
import * as ifansData from './data.json';

type IfansBoardType = {
  name: string;
  queryParams: {
    menuCl: string;
    pageIndex: string;
  };
  active: boolean;
};

type PublicationType = {
  title: string;
  link: string;
  writer: string;
  date: string;
  conciseContent: string;
  hashtags: string[];
};

function getJsonData(): typeof ifansData {
  return ifansData;
}

export async function scrapeIfans(): Promise<PublicationType[]> {
  const { baseUrl, list } = getJsonData();
  const activeBoards = list.filter((data: IfansBoardType) => data.active);

  try {
    const boardLists = await Promise.all(
      activeBoards.map(async (data: IfansBoardType) => {
        const url = `${baseUrl}?${new URLSearchParams(data.queryParams)}`;
        return getPublicationInABoard(url);
      })
    );

    return boardLists.flat();
  } catch (err) {
    console.error('Error in scrapeIfans:', err);
    return [];
  }
}

async function getPublicationInABoard(url: string): Promise<PublicationType[]> {
  try {
    const rawHtml = await getHtml(url);
    const $ = cheerioLoad(rawHtml);
    return parsePublications($);
  } catch (err) {
    console.error(`Error fetching or parsing ${url}:`, err);
    return [];
  }
}

function parsePublications($: CheerioAPI): PublicationType[] {
  const publicationListSelector = '.board_list > li';
  return $(publicationListSelector)
    .map((_, element) => {
      const $element = $(element);
      return {
        title: sanitizeText($element.find('a').first().text()),
        link: $element.find('a').first().attr('href') || '',
        writer: sanitizeText($element.find('.write').text()),
        date: sanitizeText($element.find('.date').text()),
        conciseContent: sanitizeText($element.find('.con_txt').text()),
        hashtags: $element.find('.tag a').map((_, el) => sanitizeHashtag($(el).text())).get(),
      };
    })
    .get();
}

export async function getBoardList(boardData: { baseUrl: string; queryParams: Record<string, string> }): Promise<string[]> {
  const url = `${boardData.baseUrl}?${new URLSearchParams(boardData.queryParams)}`;
  try {
    const rawHtml = await getHtml(url);
    // Implement board list parsing logic here
    return [''];
  } catch (err) {
    console.error('Error in getBoardList:', err);
    return [];
  }
}

function sanitizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/다운로드|Attached File|#.*?\s/g, '')
    .trim();
}

function sanitizeHashtag(hashtag: string): string {
  return hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
}

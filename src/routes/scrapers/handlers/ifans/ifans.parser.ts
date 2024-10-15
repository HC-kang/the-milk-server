import { getHtml } from '@src/routes/posts/common';
import { load as cheerioLoad } from 'cheerio';
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
}

function getJsonData() {
  return ifansData;
}

export async function scrapeIfans() {
  try {
    const jsonData = getJsonData();
    const { baseUrl, list } = jsonData;
    const boardList: PublicationType[] = [];

    const activeBoards = list.filter((data: IfansBoardType) => data.active);
    const publicationPromises = activeBoards.map(async (data: IfansBoardType) => {
      const url = `${baseUrl}?${new URLSearchParams(data.queryParams).toString()}`;
      const publicationList: PublicationType[] = await getPublicationInABoard(url);
      boardList.push(...publicationList);
    });

    await Promise.all(publicationPromises);

    return boardList;
  } catch (err) {
    console.error(err);
  }
}

async function getPublicationInABoard(url: string): Promise<PublicationType[]> {
  try {
    const rawHtml = await getHtml(url);
    console.log(url);
    const publicationList: PublicationType[] = [];
    
    const $ = cheerioLoad(rawHtml);
    const publicationListSelector = '.board_list > li';

    $(publicationListSelector).each((index, element) => {
      const title = $(element).find('a').first().text();
      const link = $(element).find('a').first().attr('href') || '';
      const writer = $(element).find('.write').text();
      const date = $(element).find('.date').text();
      const conciseContent = $(element).find('.con_txt').text();
      const hashtags = $(element).find('.tag').find('a').map((_, element) => $(element).text()).get();
      const publication = {
        title: sanitizeText(title),
        writer: sanitizeText(writer),
        date: sanitizeText(date),
        conciseContent: sanitizeText(conciseContent),
        hashtags: hashtags.map(sanitizeHashtag),
        link,
      }
      publicationList.push(publication);
    });
    return publicationList;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getBoardList(boardData: { baseUrl: string, queryParams: Record<string, string>}): Promise<string[]> {
  try {
    const url = `${boardData.baseUrl}?${new URLSearchParams(boardData.queryParams)}`;
    const rawHtml = await getHtml(url);
    const boardList = [''];
    return boardList;
  } catch (err) {
    console.error(err);
    return [];
  }
}

function sanitizeText(text: string): string {
  let sanitized = text.replace(/\n|\t/g, ' ').trim();

  // "다운로드"와 같은 단어 및 관련 내용을 제거
  sanitized = sanitized.replace(/다운로드/g, '');

  // 특수 파일 및 첨부파일 관련 부분 제거
  // sanitized = sanitized.replace(/\[.*?\]/g, '');

  // 여러 공백을 하나의 공백으로 변환
  sanitized = sanitized.replace(/\s+/g, ' ');

  // 파일 관련 문구 제거
  sanitized = sanitized.replace(/Attached File|#.*?\s/g, '');

  return sanitized.trim();
}

function sanitizeHashtag(hashtag: string) {
  return hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
}

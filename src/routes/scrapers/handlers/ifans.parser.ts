import { getHtml } from '@src/routes/posts/common';
import { load as cheerioLoad } from 'cheerio';

export async function scrapeIfans() {
  try {
    const rawHtml = await getHtml(
      'https://www.ifans.go.kr/knda/ifans/kor/pblct/PblctView.do?csrfPreventionSalt=null&pblctDtaSn=14378&menuCl=P07&clCode=P07&koreanEngSe=KOR&pclCode=&chcodeId=&searchCondition=searchAll&searchKeyword=&pageIndex=1'
    );
    const [title, content, hashtags] = await parseIfans(rawHtml);
    return { title, content, hashtags };
  } catch (err) {
    console.error(err);
  }
}

async function parseIfans(rawHtml: string): Promise<Array<unknown>> {
  try {
    const $ = cheerioLoad(rawHtml);
    const titleSelector = '.tit';
    const title = $(titleSelector).text();

    const contentSelector = '.board_con';
    const content = $(contentSelector).text();

    const hashtags = extractHashtags(content);

    return [sanitizeText(title), sanitizeText(content), hashtags];
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

function extractHashtags(text: string): string[] {
  const hashtags = text.match(/#\w+/g);
  return hashtags || [];
}

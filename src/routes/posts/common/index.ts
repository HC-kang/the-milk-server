export async function getHtml(url: string) {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (err) {
    console.error(err);
    return '';
  }
}

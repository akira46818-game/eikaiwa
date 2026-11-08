export default async function handler(req, res) {
  try {
    const r = await fetch('https://feeds.bbci.co.uk/news/world/rss.xml');
    const xml = await r.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 8).map(m => {
      const get = t => ((m[1].match(new RegExp('<' + t + '>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</' + t + '>')) || [])[1] || '').trim();
      return { title: get('title'), desc: get('description') };
    });
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.status(200).json(items);
  } catch (e) {
    res.status(500).json({ error: 'news error' });
  }
}

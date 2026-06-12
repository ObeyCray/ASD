const fs = require('fs');
const path = require('path');

const downloadImage = async (url, filename) => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://sites.google.com/'
      }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(path.join(__dirname, 'assets', filename), Buffer.from(buffer));
    console.log(`Downloaded ${filename} successfully`);
  } catch (err) {
    console.error(`Failed to download ${filename}:`, err.message);
  }
};

const urls = [
  { url: 'https://lh3.googleusercontent.com/sitesv/AA5AbUBK47TxBhijqeEUHNrL7kkmuV9hQlXaTqlsB834m_p47N_xPmRSs3CMOURdqUCzLwmKO6wBCI0D2OCVKwCB1Q_OJanZAr08QWGECV_hKrFH9DIJNZLL3362ors2jJNPfkULkTSx5lxnw0911xiVv1FX5e0O9T1H3J8QM9l_Pf9yGMvQ6JmnNP02A8=w16383', name: 'hero.png' },
  { url: 'https://lh3.googleusercontent.com/sitesv/AA5AbUBu6lP0uF-FiW5daQ3Z4aYcsmJlXWdBWgcQI_A9x5GzkdSSyLHLU-NLwpuAN1H_WB2fsIo-1e45_KbCsEGnFaH-i6QSpyVg2mo9p5tlNnE8x0loCQitUXNYaxW1X8wCl0oxZxZztp33S-Mb8IJ9HsPqhBKEgClUsTQZ0HEX3I264VtS7uLkGx-fdW0=w16383', name: 'kleidung.png' },
  { url: 'https://lh3.googleusercontent.com/sitesv/AA5AbUCL7jXWYJ_JsZfnXdvvBRZuFAeENRLHOKfd-G0wxt_6j55cH1OsmsVP9cCX3xUqWpmgxIaVV9wQS8F0dfF5T0cLXpgvlQNPFtkuGqdDvHXH5QoQlwNKOf6JxuyDTlH_dlSelFn6F_JuLxqb-PL1FPk7l4gEsvwfZtoxLOVaTGfohLEwuYdNJMhLEVI=w16383', name: 'fahrzeuge.png' },
  { url: 'https://lh3.googleusercontent.com/sitesv/AA5AbUAXNxkH1CPNEJwzoUn3ckzERWWUjwWrKEBNH29iI8tzH5FwiT8H8U2LMELupMOtI6t_qDGz0T2VpeAQ-2DNK_02c4q-7YfhGPVTrq2rOeXybuPvz5v1KAKaCoRnf_BKUyb2rQ-R-ypuQPctE8AtTguk4iIjVGEwS_3C-O8gYb_bnRTRdfpiTPc7-1w=w16383', name: 'team.png' }
];

async function main() {
  for (const item of urls) {
    await downloadImage(item.url, item.name);
  }
}
main();

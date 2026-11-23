const ink = '#1c1a1e';
const lineFont = '600 54px "Noto Sans Myanmar", Inter, sans-serif';

function wrapText(context, text, maxWidth) {
  const rows = [];
  const words = typeof Intl.Segmenter === 'function' && new Intl.Segmenter('my', { granularity: 'word' });
  const graphemes = words && new Intl.Segmenter('my', { granularity: 'grapheme' });
  for (const paragraph of text.split(/\r\n|[\r\n]/)) {
    let row = '';
    function append(part) {
      if (row.trim() && context.measureText(row + part).width > maxWidth) {
        rows.push(row.trimEnd());
        row = '';
      }
      row += row ? part : part.trimStart();
    }
    const tokens = words ? Array.from(words.segment(paragraph), item => item.segment) : paragraph.split(/(\s+)/);
    for (const token of tokens) {
      if (context.measureText(token).width <= maxWidth) {
        append(token);
      } else {
        const pieces = graphemes ? Array.from(graphemes.segment(token), item => item.segment) : Array.from(token);
        for (const piece of pieces) append(piece);
      }
    }
    rows.push(row.trimEnd());
  }
  return rows;
}

export async function createPostcard({ id, text }) {
  await Promise.all([
    document.fonts.load(lineFont, text),
    document.fonts.load('700 32px "Space Grotesk"', 'no cap Yangon AI'),
    document.fonts.load('400 26px Inter', 'made with by')
  ]);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable');
  ctx.font = lineFont;
  const rows = wrapText(ctx, text, 874);
  const leading = 102;
  canvas.width = 1080;
  canvas.height = Math.max(720, 318 + rows.length * leading);
  const height = canvas.height;
  const faceHeight = height - 180;

  function panel(x, y, width, panelHeight, radius, fill) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, panelHeight, radius);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, canvas.width, height);
  ctx.translate(540, height / 2);
  ctx.rotate(-Math.min(0.024, 52 / height));
  ctx.translate(-540, -height / 2);
  panel(58, 104, 978, faceHeight, 46, '#faf6e9');
  panel(46, 90, 978, faceHeight, 46, '#cdbbff');
  ctx.fillStyle = ink;
  ctx.font = lineFont;
  ctx.textBaseline = 'middle';
  const firstY = height / 2 - 12 - (rows.length - 1) * leading / 2;
  rows.forEach((row, index) => ctx.fillText(row, 98, firstY + index * leading));

  const creditY = height - 152;
  ctx.textAlign = 'right';
  ctx.font = '700 27px "Space Grotesk", sans-serif';
  const brand = 'Yangon AI';
  ctx.fillText(brand, 974, creditY);
  const brandWidth = ctx.measureText(brand).width;
  ctx.font = '400 26px Inter, sans-serif';
  ctx.fillText('made with ❤️ by ', 974 - brandWidth, creditY);

  ctx.translate(922, 90);
  ctx.rotate(0.12);
  panel(-74, -27, 148, 62, 31, ink);
  panel(-78, -34, 148, 62, 31, '#d4ff3d');
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.font = '700 32px "Space Grotesk", sans-serif';
  ctx.fillText('no cap', -4, -3);

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Could not create a PNG');
  return new File([blob], 'yangon-ai-' + id + '.png', { type: 'image/png' });
}

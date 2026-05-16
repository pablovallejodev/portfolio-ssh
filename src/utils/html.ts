export interface InlineSegment {
  text: string;
  bold?: boolean;
}

export interface ParagraphBlock {
  kind: "paragraph";
  segments: InlineSegment[];
}

export interface ListBlock {
  kind: "list";
  items: InlineSegment[][];
}

export type Block = ParagraphBlock | ListBlock;

const decodeEntities = (raw: string): string =>
  raw
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g,  "&")
    .replace(/&lt;/g,   "<")
    .replace(/&gt;/g,   ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'");

const parseInline = (raw: string): InlineSegment[] => {
  const segments: InlineSegment[] = [];
  const re = /<strong>([\s\S]*?)<\/strong>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      const text = decodeEntities(raw.slice(lastIndex, match.index));
      if (text) segments.push({ text });
    }
    const inner = decodeEntities(match[1] ?? "");
    if (inner) segments.push({ text: inner, bold: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < raw.length) {
    const text = decodeEntities(raw.slice(lastIndex));
    if (text) segments.push({ text });
  }

  return segments.filter((s) => s.text.length > 0);
};

export const parseHtml = (html: string): Block[] => {
  const blocks: Block[] = [];
  const trimmed = html.trim();
  if (!trimmed) return blocks;

  const re = /<(p|ul)>([\s\S]*?)<\/\1>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(trimmed)) !== null) {
    if (match.index > lastIndex) {
      const stray = trimmed.slice(lastIndex, match.index).trim();
      if (stray) {
        const segments = parseInline(stray);
        if (segments.length > 0) blocks.push({ kind: "paragraph", segments });
      }
    }

    const tag   = (match[1] ?? "").toLowerCase();
    const inner = match[2] ?? "";

    if (tag === "p") {
      const segments = parseInline(inner.trim());
      if (segments.length > 0) blocks.push({ kind: "paragraph", segments });
    } else if (tag === "ul") {
      const items: InlineSegment[][] = [];
      const liRe = /<li>([\s\S]*?)<\/li>/gi;
      let liMatch: RegExpExecArray | null;
      while ((liMatch = liRe.exec(inner)) !== null) {
        const cleaned = (liMatch[1] ?? "")
          .replace(/<\/?p>/gi, "")
          .replace(/\s+/g, " ")
          .trim();
        const segments = parseInline(cleaned);
        if (segments.length > 0) items.push(segments);
      }
      if (items.length > 0) blocks.push({ kind: "list", items });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < trimmed.length) {
    const tail = trimmed.slice(lastIndex).trim();
    if (tail) {
      const segments = parseInline(tail);
      if (segments.length > 0) blocks.push({ kind: "paragraph", segments });
    }
  }

  return blocks;
};

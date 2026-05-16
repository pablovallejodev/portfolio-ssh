import React from "react";
import { Box, Text } from "ink";
import { parseHtml, type Block, type InlineSegment } from "../utils/html.js";
import { theme, icons } from "../app/theme.js";

interface RichTextProps {
  html: string;
}

const Segments: React.FC<{ segments: InlineSegment[] }> = ({ segments }) => (
  <Text>
    {segments.map((seg, i) => (
      <Text key={i} bold={seg.bold}>
        {seg.text}
      </Text>
    ))}
  </Text>
);

const Item: React.FC<{ block: Block; index: number }> = ({ block, index }) => {
  if (block.kind === "paragraph") {
    return (
      <Box marginTop={index === 0 ? 0 : 1}>
        <Segments segments={block.segments} />
      </Box>
    );
  }
  return (
    <Box flexDirection="column" marginTop={index === 0 ? 0 : 1}>
      {block.items.map((segs, i) => (
        <Box key={i} flexDirection="row">
          <Box marginRight={1}>
            <Text color={theme.primary}>{icons.bullet}</Text>
          </Box>
          <Box flexGrow={1}>
            <Segments segments={segs} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const RichText: React.FC<RichTextProps> = ({ html }) => {
  const blocks = parseHtml(html);
  if (blocks.length === 0) return null;
  return (
    <Box flexDirection="column">
      {blocks.map((b, i) => (
        <Item key={i} block={b} index={i} />
      ))}
    </Box>
  );
};

import React from "react";
import { Box, Text } from "ink";
import { theme, icons } from "../app/theme.js";

interface FooterProps {
  columns: number;
}

interface Hint {
  keys: string;
  label: string;
}

const HINTS: Hint[] = [
  { keys: "1-6", label: "section" },
  { keys: "Tab", label: "next" },
  { keys: "←/→", label: "cycle" },
  { keys: "h", label: "home" },
  { keys: "q", label: "quit" },
];

export const Footer: React.FC<FooterProps> = ({ columns }) => {
  const dim = Math.max(columns - 4, 20);
  return (
    <Box flexDirection="column" paddingX={2} paddingBottom={1}>
      <Text color={theme.muted}>{"─".repeat(dim)}</Text>
      <Box flexDirection="row" flexWrap="wrap">
        {HINTS.map((h, i) => (
          <Box key={h.keys} marginRight={2}>
            {i > 0 && <Text color={theme.muted}>{` `}</Text>}
            <Text color={theme.accent} bold>
              {h.keys}
            </Text>
            <Text color={theme.muted}>{` ${icons.arrow} ${h.label}`}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

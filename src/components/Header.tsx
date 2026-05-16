import React from "react";
import { Box, Text } from "ink";
import type { Basics } from "../app/resume.js";
import { theme, icons } from "../app/theme.js";

interface HeaderProps {
  basics: Basics;
  columns: number;
}

export const Header: React.FC<HeaderProps> = ({ basics, columns }) => {
  const dim = Math.max(columns - 4, 20);
  return (
    <Box flexDirection="column" paddingX={2} paddingTop={1}>
      <Box flexDirection="row">
        <Text bold color={theme.primary}>
          {basics.name.toUpperCase()}
        </Text>
        <Text color={theme.muted}> {icons.separator} </Text>
        <Text color={theme.text}>{basics.headline}</Text>
      </Box>
      <Box flexDirection="row" marginTop={0}>
        <Text color={theme.muted}>{basics.location}</Text>
        <Text color={theme.muted}> {icons.dot} </Text>
        <Text color={theme.muted}>{basics.email}</Text>
        {basics.customFields[0] && (
          <>
            <Text color={theme.muted}> {icons.dot} </Text>
            <Text color={theme.muted}>{basics.customFields[0].text}</Text>
          </>
        )}
      </Box>
      <Text color={theme.muted}>{"─".repeat(dim)}</Text>
    </Box>
  );
};

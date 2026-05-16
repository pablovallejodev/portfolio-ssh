import React from "react";
import { Box, Text } from "ink";
import { theme } from "../app/theme.js";

interface SectionTitleProps {
  index: number;
  title: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ index, title }) => (
  <Box marginBottom={1}>
    <Text color={theme.accent} bold>
      {`0${index}`}
    </Text>
    <Text color={theme.muted}>{`  `}</Text>
    <Text color={theme.primary} bold>
      {title.toUpperCase()}
    </Text>
  </Box>
);

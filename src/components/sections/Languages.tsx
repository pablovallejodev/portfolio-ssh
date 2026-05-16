import React from "react";
import { Box, Text } from "ink";
import type { LanguageItem } from "../../app/resume.js";
import { SectionTitle } from "../SectionTitle.js";
import { theme, icons } from "../../app/theme.js";

interface LanguagesProps {
  items: LanguageItem[];
  columns: number;
}

export const Languages: React.FC<LanguagesProps> = ({ items }) => {
  return (
    <Box flexDirection="column">
      <SectionTitle index={5} title="Languages" />
      {items.map((l) => (
        <Box key={l.language} flexDirection="row">
          <Box width={12}>
            <Text bold color={theme.primary}>
              {`${icons.bullet} ${l.language}`}
            </Text>
          </Box>
          <Text color={theme.text}>{l.fluency}</Text>
        </Box>
      ))}
    </Box>
  );
};

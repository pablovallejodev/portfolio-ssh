import React from "react";
import { Box, Text } from "ink";
import type { Resume } from "../../app/resume.js";
import { RichText } from "../RichText.js";
import { SectionTitle } from "../SectionTitle.js";
import { theme, icons } from "../../app/theme.js";

interface AboutProps {
  resume: Resume;
  columns: number;
}

export const About: React.FC<AboutProps> = ({ resume }) => {
  return (
    <Box flexDirection="column">
      <SectionTitle index={1} title="About me" />
      <RichText html={resume.summary} />
      <Box marginTop={1} flexDirection="column">
        <Text color={theme.muted}>
          {`${icons.dot} `}
          <Text color={theme.text}>Location:</Text>{" "}
          <Text>{resume.basics.location}</Text>
        </Text>
        <Text color={theme.muted}>
          {`${icons.dot} `}
          <Text color={theme.text}>Languages:</Text>{" "}
          <Text>{resume.languages.map((l) => l.language).join(", ")}</Text>
        </Text>
        <Text color={theme.muted}>
          {`${icons.dot} `}
          <Text color={theme.text}>Available for:</Text>{" "}
          <Text>permanent & freelance opportunities</Text>
        </Text>
      </Box>
    </Box>
  );
};

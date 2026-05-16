import React, { useMemo } from "react";
import { Box, Text } from "ink";
import figlet from "figlet";
import { theme, icons } from "../../app/theme.js";
import { resume }      from "../../app/resume.js";
import { bannerStyle } from "../../app/bannerStyle.js";
import { project }     from "../../app/project.js";

interface WelcomeProps {
  username: string;
  columns: number;
}

const cache = new Map<string, string>();

const renderBanner = (text: string, maxCols: number, fonts: figlet.Fonts[]): string => {
  const key = `${maxCols}::${fonts.join(",")}::${text}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  for (const font of fonts) {
    try {
      const art = figlet.textSync(text, { font, horizontalLayout: "default", verticalLayout: "default" });
      const widest = art.split("\n").reduce((m, l) => Math.max(m, l.length), 0);
      if (widest <= maxCols) {
        cache.set(key, art);
        return art;
      }
    } catch { /* try next font */ }
  }

  cache.set(key, text);
  return text;
};

export const Welcome: React.FC<WelcomeProps> = ({ username, columns }) => {
  const borderCost = bannerStyle.border ? 2 : 0;
  const innerWidth = Math.max(1, columns - borderCost);

  const { rows, rowWidth } = useMemo(() => {
    const art      = renderBanner(bannerStyle.text, innerWidth, bannerStyle.fonts);
    const rawLines = art.split("\n");

    while (rawLines.length > 1 && rawLines[rawLines.length - 1]?.trim() === "") {
      rawLines.pop();
    }

    const figletWidth  = rawLines.reduce((m, l) => Math.max(m, l.length), 0);
    const targetWidth  = bannerStyle.fullWidth ? innerWidth : Math.min(innerWidth, figletWidth);
    const totalSidePad = Math.max(0, targetWidth - figletWidth);
    const leftPad      = Math.floor(totalSidePad / 2);
    const rightPad     = totalSidePad - leftPad;

    const centered = rawLines.map((l) => {
      const filled = l + " ".repeat(Math.max(0, figletWidth - l.length));
      return " ".repeat(leftPad) + filled + " ".repeat(Math.max(0, rightPad));
    });

    const padY     = bannerStyle.paddingY ?? 0;
    const emptyRow = " ".repeat(targetWidth);
    const allRows  = [...Array(padY).fill(emptyRow), ...centered, ...Array(padY).fill(emptyRow)];

    return { rows: allRows, rowWidth: targetWidth };
  }, [innerWidth]);

  const colorFor = (idx: number) =>
    bannerStyle.colors[idx % bannerStyle.colors.length] ?? theme.primary;

  const bannerInner = (
    <Box flexDirection="column" key={`b-${rowWidth}`}>
      {rows.map((line, i) => (
        <Text
          key={`${rowWidth}-${i}`}
          wrap="truncate"
          bold={bannerStyle.bold}
          color={colorFor(i)}
          backgroundColor={bannerStyle.backgroundColor}
        >
          {line}
        </Text>
      ))}
    </Box>
  );

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        {bannerStyle.border ? (
          <Box
            key={`box-${columns}`}
            borderStyle="round"
            borderColor={bannerStyle.borderColor ?? theme.primary}
            width={bannerStyle.fullWidth ? columns : undefined}
            flexDirection="column"
          >
            {bannerInner}
          </Box>
        ) : (
          bannerInner
        )}
      </Box>

      <Box flexDirection="column" paddingX={2}>
        <Text color={theme.text}>
          Hello{" "}
          <Text color={theme.accent} bold>{username}</Text>
          , welcome to my portfolio over SSH.
        </Text>
        <Text color={theme.muted}>{resume.basics.headline}</Text>

        <Box marginTop={1} flexDirection="column">
          <Text color={theme.text}>
            {`${icons.bullet} `}
            <Text color={theme.muted}>Use the keys below to navigate.</Text>
          </Text>
          <Text color={theme.text}>
            {`${icons.bullet} `}
            <Text color={theme.muted}>
              Press <Text color={theme.accent} bold>1</Text> for a quick intro,
              or <Text color={theme.accent} bold>2</Text> to jump straight into my work experience.
            </Text>
          </Text>
          <Text color={theme.text}>
            {`${icons.bullet} `}
            <Text color={theme.muted}>
              Press <Text color={theme.accent} bold>6</Text> to see how we can get in touch.
            </Text>
          </Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text color={theme.text}>
            {`${icons.bullet} `}
            <Text color={theme.muted}>Web portfolio: </Text>
            <Text color={theme.accent}>{project.web.url}</Text>
          </Text>
          <Text color={theme.text}>
            {`${icons.bullet} `}
            <Text color={theme.muted}>This SSH app · source · </Text>
            <Text color={theme.primary} bold>{project.ssh.license}</Text>
            <Text color={theme.muted}> · </Text>
            <Text color={theme.accent}>{project.ssh.repo}</Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

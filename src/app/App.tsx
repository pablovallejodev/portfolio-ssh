import React, { useEffect, useMemo, useState } from "react";
import { Box, Text, useApp, useInput, useStdout } from "ink";
import { Header }   from "../components/Header.js";
import { Footer }   from "../components/Footer.js";
import { Menu, type SectionId, sections } from "../components/Menu.js";
import { About }    from "../components/sections/About.js";
import { Experience } from "../components/sections/Experience.js";
import { Skills }   from "../components/sections/Skills.js";
import { Projects } from "../components/sections/Projects.js";
import { Languages } from "../components/sections/Languages.js";
import { Contact }  from "../components/sections/Contact.js";
import { Welcome }  from "../components/sections/Welcome.js";
import { resume }   from "./resume.js";
import { theme }    from "./theme.js";

interface AppProps {
  username: string;
  onExit: () => void;
}

const SECTION_BY_NUMBER: Record<string, SectionId> = {
  "1": "about",
  "2": "experience",
  "3": "skills",
  "4": "projects",
  "5": "languages",
  "6": "contact",
};

export const App: React.FC<AppProps> = ({ username, onExit }) => {
  const { exit } = useApp();
  const { stdout } = useStdout();

  const [section, setSection] = useState<SectionId>("welcome");
  const [size, setSize] = useState({
    columns: stdout.columns || 80,
    rows:    stdout.rows    || 24,
  });

  useEffect(() => {
    const onResize = () => {
      try { stdout.write("\u001b[2J\u001b[H"); } catch { /* ignore */ }
      setSize({ columns: stdout.columns || 80, rows: stdout.rows || 24 });
    };
    stdout.on("resize", onResize);
    return () => { stdout.off("resize", onResize); };
  }, [stdout]);

  const cycle = (delta: number) => {
    const idx = sections.findIndex((s) => s.id === section);
    if (idx === -1) { setSection(sections[0]?.id ?? "about"); return; }
    const next = sections[(idx + delta + sections.length) % sections.length];
    if (next) setSection(next.id);
  };

  useInput((input, key) => {
    if (input === "q" || key.escape || (key.ctrl && input === "c")) {
      exit(); onExit(); return;
    }
    if (key.tab && !key.shift)  return cycle(1);
    if (key.tab &&  key.shift)  return cycle(-1);
    if (key.rightArrow)         return cycle(1);
    if (key.leftArrow)          return cycle(-1);
    if (input && SECTION_BY_NUMBER[input]) {
      setSection(SECTION_BY_NUMBER[input]!); return;
    }
    if (input === "h" || input === "?") setSection("welcome");
  });

  const MIN_COLS = 60;
  const tooNarrow = size.columns < MIN_COLS;

  const body = useMemo(() => {
    if (tooNarrow) return null;
    switch (section) {
      case "welcome":    return <Welcome    username={username}           columns={size.columns} />;
      case "about":      return <About      resume={resume}               columns={size.columns} />;
      case "experience": return <Experience items={resume.experience}     columns={size.columns} />;
      case "skills":     return <Skills     groups={resume.skills}        columns={size.columns} />;
      case "projects":   return <Projects   items={resume.projects}       columns={size.columns} />;
      case "languages":  return <Languages  items={resume.languages}      columns={size.columns} />;
      case "contact":    return <Contact    basics={resume.basics}        columns={size.columns} />;
      default:           return null;
    }
  }, [section, size.columns, tooNarrow, username]);

  if (tooNarrow) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color={theme.warning} bold>Terminal too narrow.</Text>
        <Text color={theme.muted}>
          Please widen to at least {MIN_COLS} columns (currently {size.columns}).
        </Text>
        <Text color={theme.muted}>Press 'q' to quit.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" width={size.columns}>
      <Header  basics={resume.basics} columns={size.columns} />
      <Menu    active={section}       columns={size.columns} />
      <Box
        flexDirection="column"
        paddingX={section === "welcome" ? 0 : 2}
        paddingY={1}
        minHeight={Math.max(size.rows - 8, 8)}
      >
        {body}
      </Box>
      <Footer columns={size.columns} />
    </Box>
  );
};

import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { QuestComponent } from "../../components/questComponent";
import { Theme, useMediaQuery } from "@mui/material";
import { CBreakpoints } from "@styles/variables";

const QuestProjectPage = () => {
  const { query } = useRouter();
  const { id } = query as { id: string };

  const [projectName, setProjectName] = useState<string | null>(null);
  const isMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.md),
  );

  return (
    <div className="background-other" style={{ paddingBottom: isMd && 40 }}>
      <Head>
        <title>
          ${projectName} | AlphaGuilty: Turn Your Time Into Real Crypto Profits
          - Start Earning Now!
        </title>
        <link rel="canonical" href={`quest/${id}`} />
      </Head>

      <QuestComponent projectLinkTitle={id} setProjectName={setProjectName} />
    </div>
  );
};

export default QuestProjectPage;

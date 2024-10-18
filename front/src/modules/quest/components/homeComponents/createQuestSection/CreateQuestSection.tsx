import { Box } from "@mui/material";
import { Wrapper } from "./createQuestSection.styles";
import { Button } from "@/components/UI/button";
import { useRouter } from "next/router";
import { Icon } from "@/components/UI/icon";
import { Trans } from "@lingui/macro";

const CreateQuestSection = () => {
  const { push } = useRouter();

  return (
    <Wrapper>
      <Box
        component="h2"
        className="c-font-28-30 c-sm-font-65-71 c-fw-500 title"
      >
        <Trans id="8hWXKo8EGmhWaZU9U3fgb6-home">
          Join forces with{" "}
          <Box component="span" className="c-font-color-3">
            200+ projects
          </Box>
          <br />& engage{" "}
          <Box component="span" className="c-font-color-3">
            500k users
          </Box>
        </Trans>
      </Box>

      <Button
        style="colorfull"
        className="button"
        onClick={() => push("/admin/projects")}
      >
        <Box>
          <Icon name="alphaguilty-task" size="40" className="icon" />
          <Trans id="nJfbf32svqxsnjeKWXvu6n-home">Launch Quest</Trans>
        </Box>
      </Button>
    </Wrapper>
  );
};

export default CreateQuestSection;

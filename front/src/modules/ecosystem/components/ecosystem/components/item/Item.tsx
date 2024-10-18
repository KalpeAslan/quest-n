import classnames from "classnames";
import { Box } from "@mui/material";

import { Icon } from "@components/UI/icon";
import { IEcosystemItem } from "@/modules/ecosystem/models";

import { useRouter } from "next/router";
import { ItemWrapper } from "./item.styles";
import { Trans } from "@lingui/macro";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";

type Props = {
  data: IEcosystemItem;
  classname: string;
};

const Item = ({ data, classname }: Props) => {
  const { push } = useRouter();

  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(
      sendAnalyticsDataThunk({
        type: "ecosystem_project_tap",
        options: { event_property_project_name: data.title },
      }),
    );

    if (data.type === "self") {
      push(`${data.path}`);

      return;
    }

    window.open(`${data.path}`);
  };

  return (
    <ItemWrapper
      background={data.background}
      wide={data.wide}
      className={classnames(
        { ["active-link"]: data.status === "active" },
        classname,
      )}
      onClick={() => {
        if (data.status === "active") {
          handleClick();
        }
      }}
    >
      <div className="content">
        <Box className="c-font-22-24 c-md-font-20-24 c-fw-500" mb={1}>
          {data.title}
        </Box>

        <Box className="c-font-14-20 c-fw-400">{data.description}</Box>
      </div>

      {data.status === "active" && (
        <button className="button" onClick={handleClick}>
          <Icon
            name="arrow-straight"
            size="32"
            style={{ transform: "rotate(90deg)" }}
          />
        </button>
      )}

      {data.status === "soon" && (
        <p
          className={classnames(
            "soon",
            "c-font-14-20 c-fw-400 c-letter-spacing-3",
          )}
        >
          <Trans id="jeXAvbw38qyb9zxD5TobtM-ecosystem">COMING</Trans>{" "}
          {data.statusText}
        </p>
      )}
    </ItemWrapper>
  );
};

export default Item;

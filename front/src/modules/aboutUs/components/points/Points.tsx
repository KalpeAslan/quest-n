import { Box } from "@mui/material";
import classnames from "classnames";
import { Icon } from "@components/UI/icon";
import { IAboutPointItem } from "@/modules/aboutUs/models";

import { PointsWrapper } from "./points.styles";
import { Trans } from "@lingui/macro";

type Props = {
  data: IAboutPointItem[];
};

const Points = ({ data }: Props) => {
  return (
    <PointsWrapper>
      {data.map((item: IAboutPointItem) => (
        <div className="points" key={item.id}>
          <div className="image">
            <Icon name={item.icon} size="60" />
          </div>

          <div className="content">
            <p
              className={classnames(
                "title",
                "c-font-20-24 c-fw-500 c-font-color",
              )}
            >
              {item.title}

              {item.soon && (
                <Box
                  component="span"
                  className="c-button-disabled-soon c-font-12-15"
                  ml={1}
                >
                  <Trans id="oxeThwP1JQjrwkkqmwM3Ws-aboutUs">SOON</Trans>
                </Box>
              )}
            </p>

            <p
              className={classnames(
                "description",
                "c-font-14-20 c-fw-400 c-font-color-6",
              )}
            >
              {item.description}
            </p>

            {item.list && (
              <ul className="list">
                {item.list.map((item: string, ii: number) => (
                  <li className="c-font-14-20 c-fw-400 c-font-color-6" key={ii}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </PointsWrapper>
  );
};

export default Points;

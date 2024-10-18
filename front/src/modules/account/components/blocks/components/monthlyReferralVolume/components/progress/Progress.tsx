import classnames from "classnames";
import { Trans } from "@lingui/macro";
import { ProgressWrapper } from "./progress.styles";

type Props = {
  users: number;
  score: number;
  progress: number;
  label: string;
};

const Progress = ({ users, score, progress, label }: Props) => {
  return (
    <ProgressWrapper>
      <div className="progress-footer">
        <p className={classnames("users", "c-font-12-16 c-font-color")}>
          {label} - {users}{" "}
          <Trans id="x5eSPxgJsCzL6fTcrb4DB1-account">users</Trans>
        </p>

        <p className="c-font-12-16 c-font-color-3">{score} AQ</p>
      </div>

      <div className="cont">
        <div className="progress-wrapper">
          <p className="progress-score" style={{ width: `${progress}%` }}></p>
          <p
            className="progress-score-point"
            style={{ left: `calc(${progress}% - 4px)` }}
          ></p>
        </div>
      </div>
    </ProgressWrapper>
  );
};

export default Progress;

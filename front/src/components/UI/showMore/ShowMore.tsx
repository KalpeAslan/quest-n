import { useMemo, useRef, useState } from "react";
import { Trans } from "@lingui/macro";
import { Icon } from "@components/UI/icon";
import {
  ShowMoreStylesButton,
  ShowMoreStylesContent,
  ShowMoreStylesHeader,
} from "./showMore.styles";

type Props = {
  children: any;
  hideBtn?: boolean;
  isOpened?: boolean | null;
  headerClassName?: string;
  buttonClassName?: string;
  setIsOpened?: React.Dispatch<React.SetStateAction<boolean>>;
  showMoreLabel?: string;
  preview?: boolean;
  hideIcon?: boolean;
};

const ShowMore = ({
  children,
  hideBtn = false,
  isOpened,
  headerClassName,
  buttonClassName,
  setIsOpened,
  showMoreLabel,
  preview,
  hideIcon = false,
}: Props) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const [isOpenedLocal, setIsOpenedLocal] = useState<boolean>(false);

  const handleToogle = () => {
    if (isOpened !== undefined && setIsOpened !== undefined) {
      setIsOpened(!isOpened);

      return;
    }

    setIsOpenedLocal(!isOpenedLocal);
  };

  const opened = useMemo(() => {
    if (isOpened !== undefined) {
      return isOpened;
    }

    return isOpenedLocal;
  }, [isOpened, isOpenedLocal]);

  return (
    <section>
      {/*@ts-ignore*/}
      <ShowMoreStylesContent
        mb={{ xs: opened ? 1.2 : 0 }}
        ref={wrapper}
        style={{
          height: opened ? `${wrapper.current?.scrollHeight}px` : "0px",
        }}
        preview={preview}
      >
        {children}
      </ShowMoreStylesContent>

      {!hideBtn && (
        <ShowMoreStylesHeader className={headerClassName}>
          <ShowMoreStylesButton
            style="link"
            onClick={handleToogle}
            className={buttonClassName}
          >
            <>
              {opened ? (
                <span>
                  <Trans id="iHon9eJ57Uqs5RnySPdiWs-UI">Hide</Trans>
                </span>
              ) : (
                <span>
                  {showMoreLabel || (
                    <Trans id="h6Z8zz9E5dXcNffkQ4JbY7-UI">Show more</Trans>
                  )}
                </span>
              )}

              {!hideIcon && (
                <Icon
                  style={{ transform: opened ? "rotate(180deg)" : undefined }}
                  name="menu-select"
                  size="16"
                />
              )}
            </>
          </ShowMoreStylesButton>
        </ShowMoreStylesHeader>
      )}
    </section>
  );
};

export default ShowMore;

import React, { useEffect, useState, useRef } from "react";
import { styled } from "@mui/system";

import { useWindowSize } from "@hooks";
import { ITableColumn, TableTypesBody, TableTypesHead } from "@models";
import { Scroll } from "@components/UI/scroll";

import { SkeletonLoader } from "../skeletonLoader";
import { useObserver } from "@hooks/useObserver";
import classNames from "classnames";
import { Box } from "@mui/material";
import { Loader } from "../loader";

const HeaderRoot = React.forwardRef(function HeaderRoot(
  props: {
    className?: string;
    columns: ITableColumn<any>[];
    mobile: number;
    type: "primary" | "secondary" | "third";
  },
  ref: React.ForwardedRef<any>,
) {
  const { className, columns, ...other } = props;

  return (
    <header className={className} ref={ref} {...other}>
      <ul className="table-header-list">
        {columns &&
          columns.map(column => (
            <li
              className="table-header-item"
              key={column.header}
              style={{
                width: column.width,
                justifyContent: column.align,
                alignItems: column.verticalAlign,
              }}
            >
              {!column.hideHeader && column.header}
            </li>
          ))}
      </ul>
    </header>
  );
});

const BodyRoot = React.forwardRef(function BodyRoot(
  props: {
    className?: string;
    columns: ITableColumn<any>[];
    items: any[];
    emptyTitle?: string;
    mobile: number;
    type: "primary" | "secondary" | "third";
    loaded: boolean;
    maxHeight?: number;
    stickyFirstPlace?: boolean;
    paginate?: boolean;
    handleNext?: () => any;
    moreLoading?: boolean;
  },
  ref: React.ForwardedRef<any>,
) {
  const {
    className,
    columns,
    items,
    maxHeight,
    emptyTitle,
    loaded,
    stickyFirstPlace,
    handleNext,
    moreLoading,
    ...other
  } = props;
  const { width } = useWindowSize();
  const table = useRef<HTMLUListElement>(null);
  const [tableHeight, setTableHeight] = useState<number>(0);
  const listItemRef = useRef<HTMLLIElement>(null);

  const [isViewed] = useObserver(listItemRef);

  useEffect(() => {
    if (isViewed && typeof handleNext === "function") {
      handleNext();
    }
  }, [isViewed]);

  useEffect(() => {
    if (table.current) {
      setTableHeight(table.current.offsetHeight);
    }
  }, [width]);

  return (
    <section className={className} ref={ref} {...other}>
      {maxHeight ? (
        <div
          style={{
            height: `${tableHeight}px`,
            maxHeight: `${maxHeight}px`,
            display: "flex",
          }}
        >
          {items && items.length > 5 && stickyFirstPlace && loaded && (
            <ul
              className="table-body-list"
              style={{
                position: "absolute",
                top: "42px",
                right: "1px",
                left: "1px",
                borderBottom: "1px solid rgba(39, 42, 42, 1)",
                zIndex: 2,
              }}
            >
              <li className="table-body-item">
                <ul className="table-body-item-content-list">
                  {columns.map(column => {
                    return (
                      <li
                        className="table-body-item-content-list-item"
                        key={column.header}
                        style={{
                          width: column.width,
                          justifyContent: column.align,
                        }}
                      >
                        <p className="table-body-item-content-list-item-head">
                          {!column.hideHeader && column.header}
                        </p>

                        {(column as any).render(items[0])}
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          )}

          <Scroll type="table">
            <ul className="table-body-list" ref={table}>
              {items &&
                items.length > 0 &&
                loaded &&
                items.map((item, ii) => (
                  <li
                    ref={ii + 1 === items.length - 3 ? listItemRef : ref}
                    className={classNames("table-body-item", {
                      "table-body-item-selected": item.selected,
                    })}
                    key={ii}
                  >
                    <ul className="table-body-item-content-list">
                      {columns.map(column => {
                        return (
                          <li
                            className="table-body-item-content-list-item"
                            key={column.header}
                            style={{
                              width: column.width,
                              justifyContent: column.align,
                              alignItems: column.verticalAlign,
                            }}
                          >
                            <p className="table-body-item-content-list-item-head">
                              {!column.hideHeader && column.header}
                            </p>

                            {(column as any).render(item)}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}

              {items && items.length === 0 && loaded && (
                <li className="table-body-empty">
                  <p className="table-empty">
                    {emptyTitle ? emptyTitle : "Nothing found"}
                  </p>
                </li>
              )}

              {moreLoading && (
                <Box width="100%" position="relative" height="40px">
                  <Loader size={20} />
                </Box>
              )}

              {!loaded && (
                <li className="table-body-item">
                  <ul className="table-body-item-content-list">
                    {columns.map(column => {
                      return (
                        <li
                          className="table-body-item-content-list-item"
                          key={column.header}
                          style={{ width: column.width }}
                        >
                          <SkeletonLoader height="22px" width="100%" />
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
            </ul>
          </Scroll>
        </div>
      ) : (
        <ul className="table-body-list">
          {items &&
            items.length > 0 &&
            loaded &&
            items.map((item, ii) => (
              <li className="table-body-item" key={ii}>
                <ul className="table-body-item-content-list">
                  {columns.map(column => {
                    return (
                      <li
                        className="table-body-item-content-list-item"
                        key={column.header}
                        style={{
                          width: column.width,
                          justifyContent: column.align,
                          alignItems: column.verticalAlign,
                        }}
                      >
                        <p className="table-body-item-content-list-item-head">
                          {!column.hideHeader && column.header}
                        </p>

                        {(column as any).render(item)}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}

          {items && items.length === 0 && loaded && (
            <li className="table-body-empty">
              <p className="table-empty">
                {emptyTitle ? emptyTitle : "Nothing found"}
              </p>
            </li>
          )}

          {moreLoading && (
            <Box width="100%" position="relative" height="40px">
              <Loader size={20} />
            </Box>
          )}

          {!loaded && (
            <li className="table-body-item">
              <ul className="table-body-item-content-list">
                {columns.map(column => {
                  return (
                    <li
                      className="table-body-item-content-list-item"
                      key={column.header}
                      style={{ width: column.width }}
                    >
                      <SkeletonLoader height="22px" width="100%" />
                    </li>
                  );
                })}
              </ul>
            </li>
          )}
        </ul>
      )}
    </section>
  );
});

const Root = styled("section")(({ theme }) => ({}));

const Header = styled(HeaderRoot)(({ theme, mobile, type }) => ({
  ...TableTypesHead(type, mobile),
}));

const Body = styled(BodyRoot)(({ theme, mobile, type }) => ({
  ...TableTypesBody(type, mobile),
}));

interface ITable {
  columns: ITableColumn<any>[];
  items: any[] | [];
  emptyTitle?: string;
  mobile: number;
  loaded?: boolean;
  type: "primary" | "secondary" | "third";
  maxHeight?: number;
  stickyFirstPlace?: boolean;
  handleNext?: () => any;
  moreLoading?: boolean;
}

const Table = ({
  columns,
  items,
  emptyTitle,
  mobile,
  loaded,
  type,
  maxHeight,
  stickyFirstPlace,
  handleNext,
  moreLoading,
}: ITable) => {
  return (
    <Root>
      <Header columns={columns} mobile={mobile} type={type} />

      <Body
        columns={columns}
        items={items}
        emptyTitle={emptyTitle}
        mobile={mobile}
        type={type}
        handleNext={handleNext}
        loaded={loaded}
        maxHeight={maxHeight}
        stickyFirstPlace={stickyFirstPlace}
        moreLoading={moreLoading}
      />
    </Root>
  );
};

Table.defaultProps = {
  loaded: true,
  type: "primary",
  stickyFirstPlace: false,
} as Partial<ITable>;

export default Table;

import { ReactNode } from "react";

export interface ITableColumn<T> {
  hash?: string;
  header: string;
  render:
    | React.ComponentType<T>
    | ((
        props: T & {
          children?: ReactNode;
        },
        context?: any,
      ) => string | number);
  hideHeader?: boolean;
  align?: "flex-start" | "center" | "flex-end";
  verticalAlign?: "flex-start" | "center" | "flex-end";
  width: string;
}

export const TableTypesHead: any = (type: string, mobile: number) => {
  const types = {
    primary: {
      color: "var(--table-header-text-color)",
      fontFamily: "var(--font-family-1)",
      fontSize: "14px",
      lineHeight: "19px",
      letterSpacing: "3px",
      fontWeight: 500,
      textTransform: "uppercase",
      display: "none",

      ".table-header-list": {
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-around",
        listStyle: "none",
        gap: "26px",
      },

      ".table-header-item": {
        padding: "13px 0",
        display: "flex",
      },

      [`@media (min-width: ${mobile}px)`]: {
        display: "block",
      },
    },
    secondary: {
      color: "#fff",
      backgroundColor: "#1B2020",
      fontFamily: "var(--font-family-1)",
      fontSize: "12px",
      lineHeight: "15px",
      letterSpacing: "1px",
      fontWeight: 400,
      textTransform: "uppercase",
      display: "none",

      borderTop: "1px solid rgba(39, 42, 42, 1)",
      borderRight: "1px solid rgba(39, 42, 42, 1)",
      borderLeft: "1px solid rgba(39, 42, 42, 1)",
      borderTopRightRadius: "12px",
      borderTopLeftRadius: "12px",

      ".table-header-list": {
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-around",
        listStyle: "none",
      },

      ".table-header-item": {
        padding: "13px",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
      },

      [`@media (min-width: ${mobile}px)`]: {
        display: "block",

        borderTop: "1px solid rgba(39, 42, 42, 1)",
        borderRight: "1px solid rgba(39, 42, 42, 1)",
        borderLeft: "1px solid rgba(39, 42, 42, 1)",
        borderTopRightRadius: "12px",
        borderTopLeftRadius: "12px",
      },
    },
    third: {
      color: "rgba(255, 255, 255, 0.3)",
      fontFamily: "var(--font-family-1)",
      fontSize: "10px",
      lineHeight: "12px",
      fontWeight: 400,
      display: "none",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",

      ".table-header-list": {
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-around",
        listStyle: "none",
      },

      ".table-header-item": {
        padding: "10px 5px",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
      },

      [`@media (min-width: ${mobile}px)`]: {
        display: "block",
      },
    },
  };

  return (types as any)[type];
};

export const TableTypesBody: any = (type: string, mobile: number) => {
  const types = {
    primary: {
      color: "var(--table-body-text-color)",
      fontFamily: "var(--font-family-1)",
      fontSize: "16px",
      lineHeight: "28px",
      fontWeight: 400,

      ".table-body-list": {
        margin: "0 -20px",
        padding: 0,
        listStyle: "none",
      },

      ".table-body-item": {
        position: "relative",
        padding: "26px 15px",
        borderRadius: "16px",
        transition: "background-color .3s",

        "&::after": {
          position: "absolute",
          bottom: 0,
          left: "20px",
          right: "20px",
          content: '""',
          borderBottom: "1px solid var(--table-border-color)",
        },

        "&:first-of-type": {
          "&::before": {
            position: "absolute",
            top: 0,
            left: "20px",
            right: "20px",
            content: '""',
            borderBottom: "1px solid var(--table-border-color)",
          },
        },

        '&:not([disabled="true"])': {
          cursor: "pointer",
        },

        "&:hover": {
          backgroundColor: "var(--table-item-hover-color)",
        },
      },

      ".table-body-item-selected": {
        background:
          "linear-gradient(90deg, rgba(135, 246, 150, 0.11) 0%, rgba(208, 227, 86, 0.11) 100%) !important",
      },

      ".table-body-empty": {
        position: "relative",
        padding: "26px 15px",
        borderRadius: "16px",
        transition: "background-color .3s",

        "&::after": {
          position: "absolute",
          bottom: 0,
          left: "20px",
          right: "20px",
          content: '""',
          borderBottom: "1px solid var(--table-border-color)",
        },

        "&:first-of-type": {
          "&::before": {
            position: "absolute",
            top: 0,
            left: "20px",
            right: "20px",
            content: '""',
            borderBottom: "1px solid var(--table-border-color)",
          },
        },
      },

      ".table-body-item-content-list": {
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        gap: "10px",
        listStyle: "none",
      },

      ".table-body-item-content-list-item": {
        padding: "0",
        display: "flex",
        justifyContent: "space-between",
      },

      ".table-empty": {
        padding: "0 26px",
        color: "var(--table-empty-list-text-color)",
        textAlign: "center",
      },

      [`@media (max-width: ${mobile - 1}px)`]: {
        ".table-body-item-content-list-item": {
          width: "auto !important",
          justifyContent: "space-between !important",
        },
      },

      [`@media (min-width: ${mobile}px)`]: {
        ".table-body-item-content-list": {
          flexDirection: "row",
          justifyContent: "space-around",
          gap: "26px",
        },

        ".table-body-item-content-list-item": {
          ".table-body-item-content-list-item-head": {
            display: "none",
          },
        },
      },
    },
    secondary: {
      color: "var(--table-body-text-color)",
      fontFamily: "var(--font-family-1)",
      fontSize: "12px",
      lineHeight: "15px",
      fontWeight: 400,

      borderRight: "1px solid var(--table-border-color)",
      borderBottom: "1px solid var(--table-border-color)",
      borderLeft: "1px solid var(--table-border-color)",
      borderBottomRightRadius: "12px",
      borderBottomLeftRadius: "12px",
      overflow: "hidden",

      ".table-body-list": {
        margin: 0,
        padding: 0,
        listStyle: "none",
      },

      ".table-body-item": {
        position: "relative",
        borderBottom: "1px solid rgba(39, 42, 42, 1)",
        backgroundColor: "#101313",
        transition: "background-color .3s",

        "&:hover": {
          backgroundColor: "var(--table-item-hover-color)",
        },

        "&:last-of-type": {
          borderBottom: "none",
        },
      },

      ".table-body-item-selected": {
        background:
          "linear-gradient(90deg, rgba(135, 246, 150, 0.11) 0%, rgba(208, 227, 86, 0.11) 100%) !important",
      },

      ".table-body-empty": {
        position: "relative",
        transition: "background-color .3s",
      },

      ".table-body-item-content-list": {
        position: "relative",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        listStyle: "none",
        justifyContent: "space-around",
      },

      ".table-body-item-content-list-item": {
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        ".table-body-item-content-list-item-head": {
          width: "32%",
          minWidth: "32%",
        },
      },

      ".table-body-item-content-list-item .table-content": {
        position: "relative",
        marginLeft: "16px",
        textAlign: "left",
        zIndex: 2,
      },

      ".table-body-item-content-list-item .decor": {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background:
          "linear-gradient(0deg, rgba(135, 246, 150, 0.05), rgba(135, 246, 150, 0.05)), #101313",
        zIndex: 1,
      },

      ".table-empty": {
        padding: "13px",
        color: "var(--table-empty-list-text-color)",
        textAlign: "center",
      },

      [`@media (max-width: ${mobile - 1}px)`]: {
        ".table-body-item-content-list-item": {
          width: "auto !important",
          justifyContent: "space-between !important",
        },
      },

      [`@media (min-width: ${mobile}px)`]: {
        borderRight: "1px solid var(--table-border-color)",
        borderBottom: "1px solid var(--table-border-color)",
        borderLeft: "1px solid var(--table-border-color)",
        borderBottomRightRadius: "12px",
        borderBottomLeftRadius: "12px",
        overflow: "hidden",

        ".table-body-item": {
          "&:last-of-type": {
            borderBottom: "none",
          },
        },

        ".table-body-item-selected": {
          background:
            "linear-gradient(90deg, rgba(135, 246, 150, 0.11) 0%, rgba(208, 227, 86, 0.11) 100%) !important",
        },

        ".table-body-item-content-list-item .table-content": {
          marginLeft: "0",
        },

        ".table-body-item-content-list": {
          flexDirection: "row",
          justifyContent: "space-around",
        },

        ".table-body-item-content-list-item": {
          ".table-body-item-content-list-item-head": {
            display: "none",
            width: "auto",
            minWidth: "auto",
          },
        },
      },
    },
    third: {
      color: "var(--table-body-text-color)",
      fontFamily: "var(--font-family-1)",
      fontSize: "10px",
      lineHeight: "12px",
      fontWeight: 400,

      ".table-body-list": {
        margin: 0,
        padding: 0,
        listStyle: "none",
      },

      ".table-body-item": {
        position: "relative",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "background-color .3s",
      },

      ".table-body-item-selected": {
        background:
          "linear-gradient(90deg, rgba(135, 246, 150, 0.11) 0%, rgba(208, 227, 86, 0.11) 100%) !important",
      },

      ".table-body-empty": {
        position: "relative",
        transition: "background-color .3s",
      },

      ".table-body-item-content-list": {
        position: "relative",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        listStyle: "none",
        justifyContent: "space-around",
      },

      ".table-body-item-content-list-item": {
        padding: "10px 5px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },

      ".table-body-item-content-list-item .table-content": {
        position: "relative",
        marginLeft: "16px",
        zIndex: 2,
      },

      ".table-empty": {
        padding: "10px 5px",
        color: "var(--table-empty-list-text-color)",
        textAlign: "center",
      },

      [`@media (max-width: ${mobile - 1}px)`]: {
        ".table-body-item-content-list-item": {
          width: "auto !important",
          justifyContent: "space-between !important",
        },
      },

      [`@media (min-width: ${mobile}px)`]: {
        ".table-body-item-content-list-item .table-content": {
          marginLeft: "0",
        },

        ".table-body-item-content-list": {
          flexDirection: "row",
          justifyContent: "space-around",
        },

        ".table-body-item-content-list-item": {
          ".table-body-item-content-list-item-head": {
            display: "none",
          },
        },
      },
    },
  };

  return (types as any)[type];
};

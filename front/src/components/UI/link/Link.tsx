import { CSSProperties, HTMLAttributeAnchorTarget, ReactElement } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as Lnk } from "@mui/material";
import { useRouter } from "next/router";

type Props = {
  className?: string;
  style?: CSSProperties;
  href?: string;
  to?: string;
  rel?: "noreferrer";
  underline?: "none" | "hover" | "always";
  target?: HTMLAttributeAnchorTarget;
  children: string | ReactElement;
  onClick?: () => void;
};

const Link = ({
  className,
  style,
  href,
  rel,
  to,
  underline,
  target,
  children,
  onClick,
}: Props) => {
  const { push } = useRouter();

  const theme = createTheme({
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            color: "var(--text-link-color)",
            textDecorationColor: "inherit",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {to ? (
        <Lnk
          onClick={() => {
            push(to);

            if (onClick) {
              onClick();
            }
          }}
          style={{ ...style, cursor: "pointer" }}
          underline={underline}
          className={className}
        >
          {children}
        </Lnk>
      ) : (
        <Lnk
          onClick={onClick}
          style={style}
          href={href}
          target={target}
          rel={rel}
          underline={underline}
          className={className}
        >
          {children}
        </Lnk>
      )}
    </ThemeProvider>
  );
};

export default Link;

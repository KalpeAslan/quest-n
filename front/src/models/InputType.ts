export type IInputType = "primary" | "secondary";

export const InputTypes: any = {
  primary: {
    padding: "12px 35px 12px 16px",
    width: "100%",
    color: "var(--input-primary-text-color)",
    backgroundColor: "transparent",
    border: "1px solid var(--input-primary-border-color)",
    fontFamily: "var(--font-family-1)",
    fontSize: "16px",
    lineHeight: "22px",
    borderRadius: "10px",
    outline: "none",

    "::placeholder": {
      color: "var(--input-primary-placeholder-text-color)",
    },

    "&:hover": {
      border: "1px solid var(--input-primary-focus-border-color)",
    },

    "&:focus": {
      border: "1px solid var(--input-primary-focus-border-color)",
    },

    "&:focus-visible": {
      outline: "2px solid var(--input-primary-focus-outline-border-color)",
      outlineOffset: "2px",
    },

    "&[aria-invalid]": {
      border: "1px solid var(--input-primary-error-color)",
    },

    "&:focus-visible[aria-invalid]": {
      outline: "2px solid var(--input-primary-error-color)",
      outlineOffset: "2px",
    },
  },
  secondary: {
    padding: "8px 26px 8px 12px",
    width: "100%",
    color: "var(--input-secondary-text-color)",
    backgroundColor: "transparent",
    border: "1px solid var(--input-secondary-border-color)",
    fontFamily: "var(--font-family-1)",
    fontSize: "16px",
    lineHeight: "22px",
    borderRadius: "10px",
    outline: "none",

    "::placeholder": {
      color: "var(--input-secondary-placeholder-text-color)",
    },

    "&[aria-invalid]": {
      border: "1px solid var(--input-secondary-error-color)",
    },

    "&:focus-visible[aria-invalid]": {
      outline: "2px solid var(--input-secondary-error-color)",
      outlineOffset: "2px",
    },
  },
};

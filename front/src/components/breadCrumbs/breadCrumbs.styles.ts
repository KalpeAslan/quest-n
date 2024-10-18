import styled from "@emotion/styled";

export const Wrapper = styled.div`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;

  .link {
    display: flex;
    align-items: center;
    color: rgb(255 255 255 / 30%);
    text-decoration: none;
    transition: color 0.3s;
    border-radius: 4px;
  }

  .link svg {
    margin-left: 12px;
  }

  .link.active:hover {
    color: #87f696;
  }

  .link.active:active {
    color: #b5f8be;
  }

  .link.active:visited {
    background: #87f696;
  }

  .link.active:focus {
    outline: 1px solid rgb(135 246 150 / 20%);
    outline-offset: "1px";
  }

  .link.active:focus-visible {
    outline: 1px solid rgb(135 246 150 / 20%);
    outline-offset: "1px";
  }

  .link.active:disabled {
    color: "#2d3232";
    cursor: "not-allowed";
  }
`;

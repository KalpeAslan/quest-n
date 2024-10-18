import { LogoLoader } from "../logoLoader";
import { Portal } from "../portal";

const PageLoader = () => (
  <Portal wrapperId="my-portal">
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        background: "var(--app-background-color)",
        zIndex: 9000000001,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LogoLoader />
    </div>
  </Portal>
);

export default PageLoader;

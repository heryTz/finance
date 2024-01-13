import { CircularProgress } from "@mui/material";

export function Loader() {
  return (
    <div
      data-testid="loader"
      style={{
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
}

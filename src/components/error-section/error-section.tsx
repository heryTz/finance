import { Typography } from "@mui/material";

export function ErrorSection({ message }: ErrorSectionProps) {
  return (
    <div
      style={{
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: "250px", width: "100%" }}>
        <Typography color={"red"}>
          {message ?? "Ooops! something wrong"}
        </Typography>
      </div>
    </div>
  );
}

type ErrorSectionProps = { message?: string };

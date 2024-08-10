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
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  );
}

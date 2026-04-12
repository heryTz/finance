import { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Info } from "lucide-react";

export function Feedback({
  type = "default",
  title,
  description,
}: FeedbackProps) {
  return (
    <Alert variant="destructive">
      {type === "default" && <Info className="h-4 w-4" />}
      {type === "error" && <AlertCircle className="h-4 w-4" />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

type FeedbackProps = {
  type?: "error" | "default";
  title: string;
  description: ReactNode;
};

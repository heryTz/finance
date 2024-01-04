import { Block } from "@/components/block";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export function InvoiceListing() {
  const { push } = useRouter();

  return (
    <Block
      title="Mes factures"
      actionBar={<Button onClick={() => push("/invoice/new")}>Ajouter</Button>}
    >
      hello
    </Block>
  );
}

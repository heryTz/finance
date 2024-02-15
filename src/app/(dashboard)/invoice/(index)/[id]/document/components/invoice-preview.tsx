import { GetProvider } from "@/app/(dashboard)/invoice/provider/provider-service";
import { GetInvoiceById } from "../../../invoice-service";
import {
  Box,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { humanAmount } from "@/lib";

export function InvoicePreview({
  invoice,
  provider,
  invoiceClassName,
}: InvoicePreviewProps) {
  const providerData = [
    { label: "Nom", value: provider.name.toUpperCase() },
    { label: "Adresse", value: provider.address },
    { label: "Email", value: provider.email },
    { label: "Tel", value: provider.phone },
    { label: "NIF", value: provider.nif },
    { label: "SIREN", value: provider.siren },
    { label: "APE", value: provider.ape },
  ];

  const client = [
    { label: "Nom", value: invoice.Client.name.toUpperCase() },
    { label: "Adresse", value: invoice.Client.address },
    { label: "Email", value: invoice.Client.email },
    { label: "Tel", value: invoice.Client.phone },
    { label: "NIF", value: invoice.Client.nif },
    { label: "SIREN", value: invoice.Client.siren },
    { label: "APE", value: invoice.Client.ape },
  ];

  const products = invoice.Products.map((el) => ({
    name: el.name,
    qte: el.qte,
    price: el.price,
  }));
  const sumProductsHT = products.reduce((acc, cur) => acc + cur.price, 0);
  const tvaAmount = (sumProductsHT * invoice.tva) / 100;

  const payments = [
    { label: "Payable à", value: invoice.Payment.name },
    { label: "IBAN", value: invoice.Payment.iban },
    { label: "Titulaire du compte", value: invoice.Payment.accountName },
  ];

  return (
    <Paper style={{ width: "595.28pt", height: "841.89pt" }}>
      <Stack
        className={invoiceClassName}
        direction={"column"}
        gap={3}
        sx={{ p: 4 }}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Facture n° {invoice.ref} le{" "}
          <span contentEditable="true" suppressContentEditableWarning>
            {dayjs().format("DD/MM/YYYY")}
          </span>
        </Typography>
        <Divider />
        <Stack direction={"row"} gap={4} justifyContent={"space-between"}>
          <PartenaireShip
            title="Prestataire"
            data={providerData.filter((el) => !!el.value) as any}
          />
          <PartenaireShip
            title="Client"
            data={client.filter((el) => !!el.value) as any}
          />
        </Stack>
        <Divider />
        <Typography variant="h6">Description</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="right">Quantité</TableCell>
                <TableCell align="right">Prix unitaire HT</TableCell>
                <TableCell align="right" width={130}>
                  Prix total HT
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((el) => (
                <TableRow
                  key={el.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {el.name}
                  </TableCell>
                  <TableCell align="right">{el.qte}</TableCell>
                  <TableCell align="right">
                    {humanAmount(el.price)} {invoice.currency}
                  </TableCell>
                  <TableCell align="right">
                    {humanAmount(el.price)} {invoice.currency}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box maxWidth={"400px"} marginLeft={"auto"} width={"100%"}>
          <DescriptionResume
            label="Total HT"
            value={`${humanAmount(sumProductsHT)} ${invoice.currency}`}
          />
          <Divider />
          <DescriptionResume
            label={`TVA à ${invoice.tva}%`}
            value={`${tvaAmount} ${invoice.currency}`}
          />
          <Divider />
          <DescriptionResume
            label="Total TTC"
            value={`${humanAmount(sumProductsHT + tvaAmount)} ${
              invoice.currency
            }`}
            accent
          />
        </Box>
        <Divider sx={{ mt: 4 }} />
        <Typography variant="h6">Paiement</Typography>
        <Stack direction={"column"} gap={1}>
          {payments
            .filter((el) => !!el.value)
            .map((el) => (
              <Stack
                key={el.label}
                direction={"row"}
                alignItems={"center"}
                gap={1}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 14, width: 150 }}>
                  {el.label}:
                </Typography>
                <Typography sx={{ fontSize: 14 }}>{el.value}</Typography>
              </Stack>
            ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

type InvoicePreviewProps = {
  invoice: GetInvoiceById;
  provider: NonNullable<GetProvider>;
  invoiceClassName: string;
};

function PartenaireShip(props: {
  title: string;
  data: { label: string; value: string }[];
}) {
  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {props.title}
      </Typography>
      <Stack direction={"column"} gap={1}>
        {props.data.map((el) => (
          <Typography key={el.label} sx={{ fontSize: 12 }}>
            <strong
              style={{
                width: 70,
                display: "inline-block",
              }}
            >
              {el.label}:
            </strong>{" "}
            {el.value}
          </Typography>
        ))}
      </Stack>
    </div>
  );
}

function DescriptionResume(props: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  const theme = useTheme();
  return (
    <Stack
      direction={"row"}
      gap={14}
      padding={"16px"}
      color={props.accent ? theme.palette.common.white : undefined}
      bgcolor={props.accent ? theme.palette.common.black : undefined}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
        {props.label}
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          flexGrow: 1,
          textAlign: "right",
          fontWeight: props.accent ? 700 : 500,
        }}
      >
        {props.value}
      </Typography>
    </Stack>
  );
}

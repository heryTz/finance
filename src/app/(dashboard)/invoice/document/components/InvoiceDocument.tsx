"use client";

import { humanAmount } from "@/app/helper";
import {
  Box,
  Button,
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function InvoiceDocument() {
  const print = async () => {
    const pages = document.querySelectorAll<HTMLDivElement>(".invoice-pdf");
    const pdf = new jsPDF();
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i]);
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "JPEG", 0, 0, 0, 0);
      if (i !== pages.length - 1) {
        pdf.addPage();
      }
    }
    pdf.save("download.pdf");
  };

  const provider = [
    { label: "Nom", value: "RAKOTOARINIAINA HERY NIRINTSOA" },
    { label: "Adresse", value: "III J 77 Ter Adavamamba, Antananarivo 101" },
    { label: "Tel", value: "+261342107524" },
    { label: "Email", value: "hery.rakotoariniaina@gmail.com" },
    { label: "NIF", value: "1008312107" },
  ];

  const client = [
    { label: "Nom", value: "RAKOTOARINIAINA HERY NIRINTSOA" },
    { label: "Adresse", value: "III J 77 Ter Adavamamba, Antananarivo 101" },
    { label: "Tel", value: "+261342107524" },
    { label: "Email", value: "hery.rakotoariniaina@gmail.com" },
    { label: "NIF", value: "1008312107" },
  ];

  const products = [
    { name: "GCS Migraition CI3 - CI4", qte: 1, price: 1000 },
    { name: "Frais", qte: 1, price: 3 },
  ];

  const payments = [
    { label: "Payable à", value: "Western Union" },
    { label: "Titulaire du compte", value: "RAKOTOARINIAINA HERY NIRINTSOA" },
  ];

  return (
    <Stack direction={"column"} gap={3} alignItems={"center"}>
      <Paper style={{ width: "595.28pt", height: "841.89pt" }}>
        <Stack
          className="invoice-pdf"
          direction={"column"}
          gap={3}
          sx={{ p: 4 }}
        >
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Facture No: 1 le 29/12/2023
          </Typography>
          <Divider />
          <Stack direction={"row"} gap={4} justifyContent={"space-between"}>
            <PartenaireShip title="Prestataire" data={provider} />
            <PartenaireShip title="Client" data={client} />
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
                      {humanAmount(el.price)} Ar
                    </TableCell>
                    <TableCell align="right">
                      {humanAmount(el.price)} Ar
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box maxWidth={"300px"} marginLeft={"auto"}>
            <DescriptionResume
              label="Total HT"
              value={`${humanAmount(1003)} Ar`}
            />
            <Divider />
            <DescriptionResume label={`TVA à 0%`} value={`${0} Ar`} />
            <Divider />
            <DescriptionResume
              label="Total TTC"
              value={`${humanAmount(1003)} Ar`}
              accent
            />
          </Box>
          <Divider sx={{ mt: 4 }} />
          <Typography variant="h6">Paiement</Typography>
          <Stack direction={"column"} gap={1}>
            {payments.map((el) => (
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
      <Stack direction={"row"} justifyContent={"center"}>
        <Button variant="contained" onClick={print}>
          Télécharger
        </Button>
      </Stack>
    </Stack>
  );
}

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
            <strong>{el.label}:</strong> {el.value}
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

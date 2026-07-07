import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeftRight, PlusIcon, SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { AddPotDialog } from "src/features/pots/components/add-pot-dialog";
import { ArchivePotDialog } from "src/features/pots/components/archive-pot-dialog";
import { EditAllocationDialog } from "src/features/pots/components/edit-allocation-dialog";
import { EditPotDialog } from "src/features/pots/components/edit-pot-dialog";
import type { PotListItem } from "src/features/pots/components/pot-row";
import { PotRow } from "src/features/pots/components/pot-row";
import { TransferPotDialog } from "src/features/pots/components/transfer-pot-dialog";
import { potsQuery, totalBalanceQuery } from "src/features/pots/queries";
import { useFormatCurrency } from "src/shared/hooks/use-format-currency";
import { PageContent, PageHeader } from "src/shared/layout/page";
import { DataList, DataListHead } from "src/shared/ui/data-list";
import { EmptyState } from "src/shared/ui/empty-state";
import { PageActions } from "src/shared/ui/page-actions";

export function PotsPage() {
  const { data: pots } = useSuspenseQuery(potsQuery);
  const { data: balanceData } = useSuspenseQuery(totalBalanceQuery);
  const { formatFromCent } = useFormatCurrency();
  const [addOpen, setAddOpen] = useState(false);
  const [allocationOpen, setAllocationOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [editingPot, setEditingPot] = useState<PotListItem | null>(null);
  const [archivingPot, setArchivingPot] = useState<PotListItem | null>(null);

  const totalBalance = balanceData?.totalBalance ?? 0;

  const handleArchive = (pot: PotListItem) => {
    if (pot.isDefault) return;
    setArchivingPot(pot);
  };

  return (
    <PageContent>
      <PageHeader
        eyebrow="Total Balance"
        title={
          <span className="tabular-nums">{formatFromCent(totalBalance)}</span>
        }
        action={
          <PageActions
            primary={{
              key: "add-pot",
              label: "Add Pot",
              icon: <PlusIcon className="size-4" />,
              onClick: () => setAddOpen(true),
            }}
            secondary={[
              {
                key: "allocation",
                label: "Manage Allocation",
                icon: <SlidersHorizontalIcon className="size-4" />,
                onClick: () => setAllocationOpen(true),
              },
              {
                key: "transfer",
                label: "Transfer",
                icon: <ArrowLeftRight className="size-4" />,
                onClick: () => setTransferOpen(true),
                disabled: pots.length < 2,
              },
            ]}
          />
        }
      />

      {pots.length === 0 && <EmptyState>No pots yet.</EmptyState>}

      {pots.length > 0 && (
        <DataList
          header={
            <>
              <div className="size-3 shrink-0" />
              <DataListHead className="flex-1">Pot</DataListHead>
              <DataListHead className="w-12 text-right">Share</DataListHead>
              <DataListHead className="w-24 text-right">Balance</DataListHead>
              <div className="size-8 shrink-0" />
            </>
          }
        >
          {pots.map((pot) => (
            <PotRow
              key={pot.id}
              pot={pot}
              onEdit={setEditingPot}
              onArchive={handleArchive}
            />
          ))}
        </DataList>
      )}

      <AddPotDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        existingPots={pots}
      />

      {editingPot && (
        <EditPotDialog
          open={!!editingPot}
          onClose={() => setEditingPot(null)}
          pot={editingPot}
        />
      )}

      <EditAllocationDialog
        open={allocationOpen}
        onClose={() => setAllocationOpen(false)}
        allPots={pots}
      />

      {archivingPot && (
        <ArchivePotDialog
          open={!!archivingPot}
          onClose={() => setArchivingPot(null)}
          pot={archivingPot}
          remainingPots={pots.filter((p) => p.id !== archivingPot.id)}
        />
      )}

      <TransferPotDialog open={transferOpen} onOpenChange={setTransferOpen} />
    </PageContent>
  );
}

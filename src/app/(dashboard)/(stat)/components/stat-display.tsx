import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EyeIcon } from "lucide-react";
import { z } from "zod";
import { getStatsQuerySchema } from "../stat-dto";
import { statDisplayConfig } from "../stat-util";
import { AppCheckbox } from "@/components/app-checkbox";

export function StatDisplay({ display, onApply }: StatDisplayProps) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} StartIcon={EyeIcon}>
            Affichage
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-2">
            {statDisplayConfig.map((el) => (
              <AppCheckbox
                key={el.name}
                id={el.name}
                label={el.title}
                checked={display.includes(el.name)}
                onCheckedChange={(value) => {
                  if (value) {
                    onApply({ display: [...display, el.name] });
                  } else {
                    onApply({
                      display: display.filter((d) => d !== el.name),
                    });
                  }
                }}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

type StatDisplayProps = {
  display: z.infer<typeof getStatsQuerySchema>["display"];
  onApply: (data: Partial<z.infer<typeof getStatsQuerySchema>>) => void;
};

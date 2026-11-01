import { useRef, useState } from "react";
import { CircleHelp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function InfoBubble({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
  };
  const enter = () => {
    cancel();
    setOpen(true);
  };
  const leave = () => {
    if (!pinned) timer.current = setTimeout(() => setOpen(false), 120);
  };
  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setPinned(false);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="info-trigger"
          aria-label={`${label} haqqında məlumat`}
          onFocus={enter}
          onBlur={leave}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") enter();
          }}
          onPointerLeave={leave}
          onClick={(event) => {
            event.preventDefault();
            cancel();
            setPinned(!pinned);
            setOpen(!pinned);
          }}
        >
          <CircleHelp size={15} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="info-bubble"
        align="end"
        sideOffset={8}
        onPointerEnter={enter}
        onPointerLeave={leave}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        aria-label={label}
      >
        <strong>{label}</strong>
        <div>{children}</div>
      </PopoverContent>
    </Popover>
  );
}

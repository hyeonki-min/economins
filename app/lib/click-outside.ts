import { useEffect } from "react";


export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    function listener(event: PointerEvent) {
      if (!ref.current) return;

      if (ref.current.contains(event.target as Node)) {
        return;
      }

      handler();
    }

    document.addEventListener("pointerdown", listener);

    return () => {
      document.removeEventListener("pointerdown", listener);
    };
  }, [ref, handler]);
}

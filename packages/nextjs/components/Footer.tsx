import { SwitchTheme } from "~~/components/SwitchTheme";

export const Footer = () => {
  return (
    <footer className="border-t border-base-300 px-4 py-5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 text-sm text-base-content/60">
        <span>Proof Anchor · Built on Hedera</span>
        <SwitchTheme />
      </div>
    </footer>
  );
};

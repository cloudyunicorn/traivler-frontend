import { HiOutlineGlobeAlt } from "react-icons/hi2";

export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HiOutlineGlobeAlt className="w-5 h-5 text-accent" />
          <span className="font-semibold gradient-text">Traivler</span>
        </div>
        <p className="text-sm text-muted-dark">
          &copy; {new Date().getFullYear()} Traivler. AI-powered travel
          planning.
        </p>
      </div>
    </footer>
  );
}

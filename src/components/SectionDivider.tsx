interface SectionDividerProps {
  title: string;
}

export const SectionDivider = ({ title }: SectionDividerProps) => (
  <div className="mt-6 mb-3 px-4">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
      <div className="h-px flex-1 bg-slate-200"></div>
      <span className="px-2">{title}</span>
      <div className="h-px flex-1 bg-slate-200"></div>
    </div>
  </div>
);

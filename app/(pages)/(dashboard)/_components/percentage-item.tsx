type PercentageItemProps = {
  label: string;
  percentage: number;
  icon: React.ReactNode;
};

const PercentageItem = ({ label, percentage, icon }: PercentageItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center rounded-sm bg-white/4 p-1.5 shadow shadow-black/7">
          {icon}
        </span>
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-100">{percentage}%</span>
    </div>
  );
};

export default PercentageItem;

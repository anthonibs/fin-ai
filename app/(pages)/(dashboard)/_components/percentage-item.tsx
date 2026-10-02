type PercentageItemProps = {
  label: string;
  percentage: number;
  icon: React.ReactNode;
};

const PercentageItem = ({ label, percentage, icon }: PercentageItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center rounded-lg bg-white/3 p-2">{icon}</span>
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold">{percentage}%</span>
    </div>
  );
};

export default PercentageItem;

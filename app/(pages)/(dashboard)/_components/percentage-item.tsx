type PercentageItemProps = {
  label: string;
  percentage: number;
  icon: React.ReactNode;
};

const PercentageItem = ({ label, percentage, icon }: PercentageItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold">{percentage}%</span>
    </div>
  );
};

export default PercentageItem;

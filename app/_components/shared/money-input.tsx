import { ForwardedRef, forwardRef } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { Input } from "../ui/input";

const InputMaskMoney = forwardRef(
  ({ value, ...props }: NumericFormatProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <NumericFormat
        {...props}
        value={value ?? ""}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        allowNegative={false}
        customInput={Input}
        getInputRef={ref}
      />
    );
  }
);

InputMaskMoney.displayName = "InputMaskMoney";

export default InputMaskMoney;

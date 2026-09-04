import AmountInput, {
  AmountInputProps,
} from "@/components/AmountInput/AmountInput";
import WithLabel from "@/pages/ui/WithLabel";

interface Props extends Omit<AmountInputProps, "bgColor"> {
  label: string;
}

const TextFilter: React.FC<Props> = props => {
  const {label, ...inputProps} = props;
  return (
    <WithLabel label={label}>
      <AmountInput {...inputProps} bgColor="white dark:bg-dark-bg" />
    </WithLabel>
  );
};

export default TextFilter;

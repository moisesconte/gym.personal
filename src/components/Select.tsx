import {
  Select as NativeBaseSelect,
  ISelectProps,
  FormControl,
} from "native-base";

type Props = ISelectProps & {
  itens: {
    label: string;
    value: string;
  }[];
  errorMessage?: string | null;
};

export function Select({ itens, errorMessage = null, ...rest }: Props) {
  const invalid = !!errorMessage;
  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseSelect
        bg="gray.700"
        h={14}
        px={4}
        borderWidth={0}
        placeholderTextColor="gray.300" 
        fontSize="md"
        color="white"
        fontFamily="body"
        {...rest}
      >
        {itens.map((item) => (
          <NativeBaseSelect.Item
            key={item.value}
            label={item.label}
            value={item.value}
          />
        ))}
      </NativeBaseSelect>

      <FormControl.ErrorMessage _text={{ color: "red.500" }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}

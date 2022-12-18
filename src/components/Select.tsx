import {
  Select as NativeBaseSelect,
  ISelectProps,
  FormControl,
  Text,
} from "native-base";

type Props = ISelectProps & {
  label?: string;
  itens: {
    label: string;
    value: string;
  }[];
  errorMessage?: string | null;
};

export function Select({ label, itens, errorMessage = null, ...rest }: Props) {
  const invalid = !!errorMessage;
  return (
    <FormControl isInvalid={invalid} mb={4}>
      {!!label && (
        <Text color="gray.300" fontSize="md" mb={1}>
          {label}
        </Text>
      )}
      <NativeBaseSelect
        bg="gray.700"
        h={14}
        px={4}
        borderWidth={0}
        placeholderTextColor="gray.300"
        fontSize="md"
        color="white"
        fontFamily="body"
        borderColor="red.500"
        borderStyle="solid"
        borderTopWidth={invalid ? 1 : 0}
        borderBottomWidth={invalid ? 1 : 0}
        borderLeftWidth={invalid ? 1 : 0}
        borderRightWidth={invalid ? 1 : 0}
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

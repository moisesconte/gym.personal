import {
  FormControl,
  Radio as NativeBaseRadio,
  Text,
  HStack,
  IRadioGroupProps,
} from "native-base";

type Props = IRadioGroupProps & {
  label?: string;
  options: {
    value: string;
    label: string;
  }[];
  errorMessage?: string | null;
};

export function Radio({
  label,
  options,
  errorMessage,
  isInvalid,
  ...rest
}: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      {!!label && (
        <Text color="gray.300" fontSize="md" mb={1}>
          {label}
        </Text>
      )}

      <NativeBaseRadio.Group {...rest}>
        <HStack space={4}>
          {options.map((option) => (
            <NativeBaseRadio
              key={option.value}
              value={option.value}
              color="white"
            >
              <Text color="white">{option.label}</Text>
            </NativeBaseRadio>
          ))}
        </HStack>
      </NativeBaseRadio.Group>

      <FormControl.ErrorMessage _text={{ color: "red.500" }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}

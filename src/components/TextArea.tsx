import {
  TextArea as NativeBaseTextArea,
  ITextAreaProps,
  FormControl,
  Text,
} from "native-base";

type Props = ITextAreaProps & {
  label?: string;
  errorMessage?: string | null;
};

export function TextArea({
  label,
  errorMessage = null,
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
      <NativeBaseTextArea
        autoCompleteType=""
        bg="gray.700"
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"
        placeholderTextColor="gray.300"
        isInvalid={invalid}
        _invalid={{
          borderWidth: 1,
          borderColor: "red.500",
        }}
        _focus={{
          bg: "gray.700",
          borderWidth: 1,
          borderColor: "green.500",
        }}
        {...rest}
      />

      <FormControl.ErrorMessage _text={{ color: "red.500" }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}

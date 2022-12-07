import {
  Select as NativeBaseSelect,
  ISelectProps,
  FormControl,
} from "native-base";

type Props = ISelectProps & {
  errorMessage?: string | null;
};

export function Select({ errorMessage = null, ...rest }: Props) {

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseSelect
        bg="gray.700"
        h={14}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"

 
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

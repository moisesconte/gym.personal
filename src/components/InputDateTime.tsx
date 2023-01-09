import {
  Input as NativeBaseInput,
  IPinInputProps,
  FormControl,
  IconButton,
  Icon,
  Text,
} from "native-base";
import { Feather } from "@expo/vector-icons";

type Props = IPinInputProps & {
  label?: string;
  errorMessage?: string | null;
};

export function InputDateTime({
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
      <NativeBaseInput
        bg="gray.700"
        h={14}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"
        placeholderTextColor="gray.300"
        rightElement={
          <IconButton
            icon={<Icon as={Feather} name="calendar" color="green.500" />}
            bgColor="gray.600"
            borderLeftRadius="none"
          />
        }
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

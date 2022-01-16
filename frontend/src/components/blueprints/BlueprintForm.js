import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  chakra,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import { cookies } from "../../App";

export default function BlueprintForm(props) {
  function handleSubmit(e) {
    const blueprintName = e.target.blueprintName.value;
    const blueprintME = e.target.blueprintME.value;
    const blueprintTE = e.target.blueprintTE.value;
    const blueprintRuns = e.target.blueprintRuns.value;
    const blueprintCopies = e.target.blueprintCopies.value;

    e.preventDefault();
    fetch("/api/add_print/", {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({
        blueprintName: blueprintName,
        blueprintME: blueprintME,
        blueprintTE: blueprintTE,
        blueprintRuns: blueprintRuns,
        blueprintCopies: blueprintCopies,
      }),
    })
      .then((response) => {
        if (response.ok) {
          props.getBlueprints();
        }
      });
  }

  return (
    <>
      <Box mx={[8, 20]} mt={6}>
        <chakra.form onSubmit={handleSubmit} autoComplete="off">
          <Box px={10} py={6} bg={useColorModeValue("green.100", "gray.700")}>
            <SimpleGrid columns={4} spacing={6}>
              <FormControl as={GridItem} colSpan={4} isRequired>
                <FormLabel htmlFor="blueprintName">Blueprint</FormLabel>
                <Input id="blueprintName" type="text" />
              </FormControl>

              <FormControl as={GridItem} colSpan={[4, 2, 1]}>
                <FormLabel htmlFor="blueprintME">ME</FormLabel>
                <NumberInput
                  id="blueprintME"
                  min={0}
                  max={10}
                  defaultValue={0}
                  precision={0}
                  allowMouseWheel
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl as={GridItem} colSpan={[4, 2, 1]}>
                <FormLabel htmlFor="blueprintTE">TE</FormLabel>
                <NumberInput
                  id="blueprintTE"
                  min={0}
                  max={20}
                  step={2}
                  defaultValue={0}
                  precision={0}
                  allowMouseWheel
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl as={GridItem} colSpan={[4, 2, 1]}>
                <FormLabel htmlFor="blueprintRuns">Runs</FormLabel>
                <NumberInput
                  id="blueprintRuns"
                  min={1}
                  defaultValue={1}
                  precision={0}
                  allowMouseWheel
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl as={GridItem} colSpan={[4, 2, 1]}>
                <FormLabel htmlFor="blueprintCopies">Copies</FormLabel>
                <NumberInput
                  id="blueprintCopies"
                  min={1}
                  defaultValue={1}
                  precision={0}
                  allowMouseWheel
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </SimpleGrid>
          </Box>
          <Box
            px={{ base: 4, sm: 6 }}
            py={3}
            bg={useColorModeValue("gray.150", "gray.900")}
            textAlign="right"
          >
            <Button type="submit" fontWeight="md">
              Save
            </Button>
          </Box>
        </chakra.form>
      </Box>
    </>
  );
}

import {
  Button,
  GridItem,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { cookies } from "../../App";

export default function BlueprintCard(props) {
  function update_print(id, modType, modValue) {
    fetch("/api/update_print/", {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({
        blueprintID: id,
        modType: modType,
        modValue: modValue,
      }),
    }).then((response) => {
      if (response.ok) {
        props.getBlueprints()
      }
    });
  }

  function delete_print(id) {
    fetch("/api/delete_print/", {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({
        blueprintID: id,
      }),
    }).then((response) => {
      if (response.ok) {
        props.getBlueprints()
      }
    });
    props.getBlueprints()
  }

  const bp_grid = (
    <div>
    <Text>{props.blueprint.blueprintName}</Text>
      <GridItem colSpan={{ base: 2, sm: 1 }}>
        <Stack direction={"row"}>
          <Text textAlign={"right"} width="6rem" px={3}>
            ME:
          </Text>
          <NumberInput
            min={0}
            max={10}
            defaultValue={props.blueprint.blueprintME}
            precision={0}
            onChange={(val) =>
              update_print(props.blueprint.blueprintID, "ME", val)
            }
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Stack>
      </GridItem>
      <GridItem colSpan={{ base: 2, sm: 1 }}>
        <Stack direction={"row"}>
          <Text textAlign={"right"} width="6rem" px={3}>
            TE:
          </Text>
          <NumberInput
            min={0}
            max={20}
            step={2}
            defaultValue={props.blueprint.blueprintTE}
            precision={0}
            onChange={(val) =>
              update_print(props.blueprint.blueprintID, "TE", val)
            }
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Stack>
      </GridItem>
      <GridItem colSpan={{ base: 2, sm: 1 }}>
        <Stack direction={"row"}>
          <Text textAlign={"right"} width="6rem" px={3}>
            Runs:
          </Text>
          <NumberInput
            min={1}
            defaultValue={props.blueprint.blueprintRuns}
            precision={0}
            onChange={(val) =>
              update_print(props.blueprint.blueprintID, "Runs", val)
            }
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Stack>
      </GridItem>
      <GridItem colSpan={{ base: 2, sm: 1 }}>
        <Stack direction={"row"}>
          <Text textAlign={"right"} width="6rem" px={3}>
            Copies:
          </Text>
          <NumberInput
            min={1}
            defaultValue={props.blueprint.blueprintCopies}
            precision={0}
            onChange={(val) =>
              update_print(props.blueprint.blueprintID, "Copies", val)
            }
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Stack>
      </GridItem>
    </div>
  );

  return (
    <Stack
      as={GridItem}
      colSpan={[2, 1]}
      direction={{ sm: "column", md: "row" }}
      bg={useColorModeValue("green.100", "gray.700")}
      rounded="lg"
      spacing={useBreakpointValue({
        base: "4",
        md: "5",
      })}
    >
      <Image
        src="https://wiki.eveuniversity.org/images/thumb/7/71/Caracal.jpg/64px-Caracal.jpg"
        boxSize="96px"
        draggable="false"
        fallback={<Skeleton />}
        borderRadius="md"
      />
      {bp_grid}
      <Button onClick={() => delete_print(props.blueprint.blueprintID)}>
        Delete
      </Button>
    </Stack>
  );
}

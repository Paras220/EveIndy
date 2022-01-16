import {
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import BlueprintCard from "./BlueprintCard";

export default function BlueprintsArea(props) {
  return (
    <>
      <Box mx={[8, 10]} mt={8}>
        <SimpleGrid
          columns={[2, 4]}
          columnGap={{
            base: "4",
            md: "6",
          }}
          rowGap={{
            base: "8",
            md: "10",
          }}
        >
          {props.blueprints.map((bp) => (
            <BlueprintCard getBlueprints={props.getBlueprints} blueprint={bp} />
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}

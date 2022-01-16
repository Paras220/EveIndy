import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function BuildConfig() {
  const [materials, setMaterials] = useState(null);

  const getMaterials = () => {
    fetch("/api/get_materials/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMaterials(data);
      })
      .catch((err) => {
        console.log("could not get data. err: " + err);
      });
  };

  useEffect(() => {
    getMaterials();
  }, []);

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Quantity</Th>
          </Tr>
        </Thead>
        <Tbody>
          {materials !== null
            ? Object.entries(materials).map(([key, value]) => (
                <Tr>
                  <Td>{key}</Td>
                  <Td>{value}</Td>
                </Tr>
              ))
            : null}
        </Tbody>
      </Table>
    </Box>
  );
}

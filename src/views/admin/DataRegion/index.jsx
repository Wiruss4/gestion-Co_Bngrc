// frontend/src/views/admin/DataRegion/index.jsx

import { Box, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "views/admin/DataRegion/components/DevelopmentTable";
import CheckTable from "views/admin/DataRegion/components/CheckTable";
import ColumnsTable from "views/admin/DataRegion/components/ColumnsTable";
import ComplexTable from "views/admin/DataRegion/components/ComplexTable";
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "views/admin/DataRegion/variables/columnsData";
import tableDataCheck from "views/admin/DataRegion/variables/tableDataCheck.json";
import tableDataColumns from "views/admin/DataRegion/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/DataRegion/variables/tableDataComplex.json";
import { useEffect, useState } from "react";
import React from "react";

export default function Settings() {
  const [tableDataDevelopment, setTableDataDevelopment] = useState([]);

  useEffect(() => {
    fetch("https://api.example.com/development-data") // Remplacez par votre URL d'API
      .then((response) => response.json())
      .then((data) => setTableDataDevelopment(data))
      .catch((error) => console.error("Erreur lors du chargement :", error));
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 2 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <DevelopmentTable
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        />
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <ColumnsTable columnsData={columnsDataColumns} tableData={tableDataColumns} />
        <ComplexTable columnsData={columnsDataComplex} tableData={tableDataComplex} />
      </SimpleGrid>
    </Box>
  );
}

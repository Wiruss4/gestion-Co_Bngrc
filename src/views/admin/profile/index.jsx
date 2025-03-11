// frontend/src/views/admin/profile/index.jsx
// Chakra imports
import { Box, Grid } from "@chakra-ui/react";

// Custom components
import General from "views/admin/profile/components/General";
import Projects from "views/admin/profile/components/Projects";
import Storage from "views/admin/profile/components/Storage";
import Upload from "views/admin/profile/components/Upload";

import React from "react";

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        templateRows={{ base: "repeat(4, auto)", md: "1fr 1fr" }}
        gap={{ base: "20px", md: "25px" }}>
        
        {/* Table Storage en haut à gauche */}
        <Storage
          gridArea={{ base: "1 / 1 / 2 / 2", md: "1 / 1 / 2 / 2" }}
          used={25.6}
          total={50}
          minH={{ base: "auto", md: "300px", lg: "350px" }}
        />

        {/* Table General en bas à droite */}
        <General
          gridArea={{ base: "4 / 1 / 5 / 2", md: "2 / 2 / 3 / 3" }}
          minH={{ base: "auto", md: "300px", lg: "350px" }}
          pe="20px"
        />

        {/* Table Upload en haut à droite
        <Upload
          gridArea={{ base: "2 / 1 / 3 / 2", md: "1 / 2 / 2 / 3" }}
          minH={{ base: "auto", md: "300px", lg: "350px" }}
          pe="20px"
        /> */}

        {/* Table Projects en bas à gauche */}
        <Projects
          gridArea={{ base: "3 / 1 / 4 / 2", md: "2 / 1 / 3 / 2" }}
          minH={{ base: "auto", md: "300px", lg: "350px" }}
        />

         {/* Table Upload en haut à droite */}
         <Upload
          gridArea={{ base: "2 / 1 / 3 / 2", md: "1 / 2 / 2 / 3" }}
          minH={{ base: "auto", md: "300px", lg: "350px" }}
          pe="20px"
        />

        {/* Table General en bas à droite
        <General
          gridArea={{ base: "4 / 1 / 5 / 2", md: "2 / 2 / 3 / 3" }}
          minH={{ base: "auto", md: "300px", lg: "350px" }}
          pe="20px"
        /> */}
      </Grid>
    </Box>
  );
}

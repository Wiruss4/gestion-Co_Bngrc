// frontend/src/views/admin/DataSite/index.jsx
// Chakra imports
import { Box, Grid } from "@chakra-ui/react";

// Custom components
import GestionSecteur from "views/admin/DataSite/components/GestionSecteur";
import DataSuiviSIte from "views/admin/DataSite/components/DataSuiviSIte";
import SIteHebergement from "views/admin/DataSite/components/SIteHebergement";
import Besoint from "views/admin/DataSite/components/Besoint";

import React from "react";

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        templateRows={{ base: "repeat(4, auto)", md: "1fr 1fr" }}
        gap={{ base: "20px", md: "25px" }}>
        
        {/* Table SIteHebergement en haut à gauche */}
        <SIteHebergement
          gridArea={{ base: "1 / 1 / 2 / 2", md: "1 / 1 / 2 / 2" }}
          used={25.6}
          total={50}
          minH={{ base: "auto", md: "300px", lg: "350px" }}
        />

        {/* Table GestionSecteur en bas à droite */}
        <GestionSecteur
          gridArea={{ base: "4 / 1 / 5 / 2", md: "2 / 2 / 3 / 3" }}
          minH={{ base: "auto", md: "300px", lg: "350px" }}
          pe="20px"
        />

        {/* Table Besoint en haut à droite
        <Besoint
          gridArea={{ base: "2 / 1 / 3 / 2", md: "1 / 2 / 2 / 3" }}
          minH={{ base: "auto", md: "300px", lg: "350px" }}
          pe="20px"
        /> */}

        {/* Table DataSuiviSIte en bas à gauche */}
        <DataSuiviSIte
          gridArea={{ base: "3 / 1 / 4 / 2", md: "2 / 1 / 3 / 2" }}
          minH={{ base: "auto", md: "300px", lg: "350px" }}
        />

         {/* Table Besoint en haut à droite */}
         <Besoint
          gridArea={{ base: "2 / 1 / 3 / 2", md: "1 / 2 / 2 / 3" }}
          minH={{ base: "auto", md: "300px", lg: "350px" }}
          pe="20px"
        />

        {/* Table GestionSecteur en bas à droite
        <GestionSecteur
          gridArea={{ base: "4 / 1 / 5 / 2", md: "2 / 2 / 3 / 3" }}
          minH={{ base: "auto", md: "300px", lg: "350px" }}
          pe="20px"
        /> */}
      </Grid>
    </Box>
  );
}

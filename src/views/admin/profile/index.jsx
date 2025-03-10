// Chakra imports
import { Box, Grid } from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/profile/components/Banner";
import General from "views/admin/profile/components/General";
import Notifications from "views/admin/profile/components/Notifications";
import Projects from "views/admin/profile/components/Projects";
import Storage from "views/admin/profile/components/Storage";
import Upload from "views/admin/profile/components/Upload";

// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React from "react";

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "1fr 1fr",
          lg: "1.2fr 1.6fr 1.2fr", // ✅ Storage encore plus grand
        }}
        templateRows={{
          base: "repeat(3, auto)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "25px" }}>

        <Banner
          gridArea="1 / 1 / 2 / 2"
          banner={banner}
          avatar={avatar}
          name="Adela Parkson"
          job="Product Designer"
          posts="17"
          followers="9.7k"
          following="274"
        />

        {/* 🔥 Agrandissement de Storage */}
        <Storage
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          used={25.6}
          total={50}
          minH={{ base: "auto", md: "400px", lg: "500px", "2xl": "550px" }} // 📌 Plus grand sur les écrans larges
        />

        {/* 🔥 Réduction de Upload */}
        <Upload
          gridArea={{
            base: "3 / 1 / 4 / 2",
            lg: "1 / 3 / 2 / 4",
          }}
          minH={{ base: "auto", md: "280px", lg: "250px", "2xl": "230px" }} // 📌 Plus petit
          pe="20px"
          pb={{ base: "80px", lg: "15px" }} // 📌 Réduction du padding
        />
      </Grid>

      {/* 🔥 Ajout d'un espace entre les deux sections */}
      <Grid
        mt={{ base: "40px", lg: "50px", "2xl": "60px" }} // 🆕 Ajout d'espace entre les sections
        mb="20px"
        templateColumns={{
          base: "1fr", // ✅ S'assure que Projects prend toute la largeur sur petit écran
          md: "1fr 1fr", // ✅ Deux colonnes sur tablette
          "2xl": "1.5fr 1.5fr",
        }}
        templateRows={{
          base: "auto auto", // ✅ Permet à Projects et General d'exister sur petit écran
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "25px" }}>

        {/* 🔥 Correction de l'affichage sur mobile */}
        <Projects
          gridArea={{ base: "1 / 1 / 2 / 2", md: "1 / 1 / 2 / 2" }} // 📌 S'assure qu'il est bien visible
          banner={banner}
          avatar={avatar}
          name="Adela Parkson"
          job="Product Designer"
          posts="17"
          followers="9.7k"
          following="274"
        />

        <General
          gridArea={{ base: "2 / 1 / 3 / 2", md: "1 / 2 / 2 / 3" }} // 📌 S'assure qu'il suit Projects en mobile
          minH="365px"
          pe="20px"
        />
      </Grid>
    </Box>
  );
}

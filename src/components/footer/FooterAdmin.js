/*eslint-disable*/
import React from "react";
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  const textColor = useColorModeValue("gray.400", "white");
  const { toggleColorMode } = useColorMode();
  return (
    <Flex
      zIndex='3'
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent='space-between'
      px={{ base: "30px", md: "50px" }}
      pb='30px'>
      <Text
        color={textColor}
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", xl: "0px" }}>
        {" "}
        &copy; {1900 + new Date().getYear()}
        <Text as='span' fontWeight='500' ms='4px'>
          BNGRC. All Rights Reserved. Made with love by
          <Link
            mx='3px'
            color={textColor}
            // href='https://www.simmmple.com?ref=horizon-chakra-free'
            target='_blank'
            fontWeight='700'>
            Michel Danis & Alson Nahdi
          </Link>
        </Text>
      </Text>
      <List display='flex'>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            fontWeight='500'
            color={textColor}
            href='mailto:cobngrc@gmail.com'>
            Support
          </Link>
        </ListItem>
        {/* <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            fontWeight='500'
            color={textColor}
            href='https://www.simmmple.com/licenses?ref=horizon-chakra-free'>
            License
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            fontWeight='500'
            color={textColor}
            href='https://simmmple.com/terms-of-service?ref=horizon-chakra-free'>
            Terms of Use
          </Link>
        </ListItem> */}
        <ListItem>
          <Link
            fontWeight='500'
            color={textColor}
            href='https://bngrc.gov.mg/'>
            Bngrc
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}

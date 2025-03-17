'use client';

import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";

// import Usa from "assets/img/dashboards/usa.png";
import MiniStatistics from "components/card/MiniStatistics";
// import IconBox from "components/icons/IconBox";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import axios from "axios";

import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import MiniCalendar from "components/calendar/MiniCalendar";
// import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import Usa from "assets/img/dashboards/usa.png";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";

export default function UserReports() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  useEffect(() => {
    axios.get('http://localhost:4000/api/site-hebergement')
      .then(res => {
        setSites(res.data);
        if (res.data.length > 0) {
          setSelectedSite(res.data[0].id_site);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'
      >
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
          name='Earnings'
          value='$350.4'
        />
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />} />}
          name='Spend this month'
          value='$642.39'
        />
        <MiniStatistics growth='+23%' name='Sales' value='$574.34' />
        <MiniStatistics
          endContent={
            <Flex me='-16px' mt='10px' align='center'>
              <FormLabel htmlFor='balance'>
                <Avatar src={Usa} />
              </FormLabel>
              <Select
                onChange={(e) => setSelectedSite(e.target.value)}
                value={selectedSite}
              >
                {sites.map(site => (
                  <option key={site.id_site} value={site.id_site}>
                    {site.nom_site}
                  </option>
                ))}
              </Select>
            </Flex>
          }
          name='Your balance'
          value='Sélectionnez un site'
        />
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)' icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />} />}
          name='New Tasks'
          value='154'
        />
        <MiniStatistics
          startContent={<IconBox w='56px' h='56px' bg={boxBg} icon={<Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />} />}
          name='Total Projects'
          value='2935'
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <TotalSpent selectedSite={selectedSite} onPointSelect={(point) => setPointDetail(point)} />
        <WeeklyRevenue />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <DailyTraffic />
          <PieCard />
        </SimpleGrid>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <ComplexTable columnsData={columnsDataComplex} tableData={tableDataComplex} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}

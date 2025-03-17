// frontend/src/views/admin/default/index.jsx

'use client';

import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  Text,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';

// import Usa from "assets/img/dashboards/usa.png";
import MiniStatistics from 'components/card/MiniStatistics';
// import IconBox from "components/icons/IconBox";
import {
  MdAddTask,
  MdEditCalendar,
  MdAddHome,
  MdBarChart,
  MdFileCopy,
} from 'react-icons/md';
import axios from 'axios';

import PointGraphSuivi from 'views/admin/default/components/PointGraphSuivi';
import ComplexTable from 'views/admin/default/components/ComplexTable';
import DailyTraffic from 'views/admin/default/components/DailyTraffic';
import PieCard from 'views/admin/default/components/PieCard';
import Tasks from 'views/admin/default/components/Tasks';
import Graphesuivi from 'views/admin/default/components/Graphesuivi';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import MiniCalendar from 'components/calendar/MiniCalendar';
// import MiniStatistics from "components/card/MiniStatistics";
import IconBox from 'components/icons/IconBox';
import Usa from 'assets/img/dashboards/usa.png';
import {
  columnsDataCheck,
  columnsDataComplex,
} from 'views/admin/default/variables/columnsData';
import tableDataCheck from 'views/admin/default/variables/tableDataCheck.json';
import tableDataComplex from 'views/admin/default/variables/tableDataComplex.json';

export default function UserReports() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [pointDetail, setPointDetail] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("Tous les mois");

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/site-hebergement')
      .then((res) => {
        setSites(res.data);
        if (res.data.length > 0) {
          setSelectedSite(res.data[0].id_site);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const months = [
    "Tous les mois",
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          endContent={
            <Flex me="16px" mt="10px" align="center">
              <Select
                onChange={(e) => setSelectedSite(e.target.value)}
                value={selectedSite}
              >
                {sites.map((site) => (
                  <option key={site.id_site} value={site.id_site}>
                    {site.nom_site}
                  </option>
                ))}
              </Select>
            </Flex>
          }
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={
                <Icon w="32px" h="32px" as={MdAddHome} color={brandColor} />
              }
            />
          }
          name="SITE"
        />
        <MiniStatistics
          endContent={
            <Flex me="px" mt="8px" direction="column" align="center">
              {/* Sélection de l'année */}
              <Select
                size="xs"
                w="100px"
                mb="5px"
                onChange={(e) => setSelectedYear(e.target.value)}
                value={selectedYear}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>

              {/* Sélection du mois */}
              <Select
                size="xs"
                w="100px"
                onChange={(e) => setSelectedMonth(e.target.value)}
                value={selectedMonth}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </Select>
            </Flex>
          }
          startContent={
            <IconBox
            mt="10px"
              w="50px"
              h="50px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="32px" h="32px" as={MdEditCalendar} color={"black"} />}
            />
            
          }
          name={<Text fontSize="20px" fontWeight="bold" color="gray.500">Filtre Date</Text>} // Augmente la taille du titre
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdEditCalendar} color={brandColor} />
              }
            />
          }
          name="Spend this month"
          value="$642.39"
        />
        <MiniStatistics growth="+23%" name="Sales" value="$574.34" />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
            />
          }
          name="New Tasks"
          value="154"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Total Projects"
          value="2935"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <Graphesuivi
          selectedSite={selectedSite}
          onPointSelect={(point) => setPointDetail(point)}
        />
        <WeeklyRevenue />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <PointGraphSuivi columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <DailyTraffic />
          <PieCard />
        </SimpleGrid>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <Tasks />
          <MiniCalendar h="100%" minW="100%" selectRange={false} />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}

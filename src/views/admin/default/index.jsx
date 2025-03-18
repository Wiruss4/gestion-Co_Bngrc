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
  Button,
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
  MdCalendarToday,
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
  const [selectedDay, setSelectedDay] = useState(0);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(0);

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const formatDate = (day, month, year) => {
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
    }).format(date);
  };

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
    { value: 0, label: 'Tous les mois' },
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  // Calcul des jours disponibles
  useEffect(() => {
    const getDaysArray = () => {
      if (selectedMonth === 0) return [];
      const year = selectedYear;
      const month = selectedMonth;
      const days = new Date(year, month, 0).getDate();

      const daysArray = [{ value: 0, label: 'Tous les jours' }];
      for (let d = 1; d <= days; d++) {
        daysArray.push({ value: d, label: d.toString() });
      }
      return daysArray;
    };

    setDaysInMonth(getDaysArray());
    if (selectedMonth === 0) setSelectedDay(0);
  }, [selectedMonth, selectedYear]);

  // Formatage de l'affichage
  const formatDateDisplay = () => {
    if (selectedMonth === 0) return selectedYear.toString();
    if (selectedDay === 0) {
      return `${
        months.find((m) => m.value === selectedMonth)?.label
      } ${selectedYear}`;
    }
    return `${selectedDay} ${
      months.find((m) => m.value === selectedMonth)?.label
    } ${selectedYear}`;
  };

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i,
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          endContent={
            <Flex me="px" mt="30px" align="center">
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
              mt="30px"
              w="40px"
              h="40px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={
                <Icon w="32px" h="32px" as={MdAddHome} color={brandColor} />
              }
            />
          }
          name="SITE Appliqué"
        />

        {/* Sélecteur Jour */}
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon
                  w="32px"
                  h="32px"
                  as={MdEditCalendar}
                  color={brandColor}
                />
              }
            />
          }
          name="FILTRE DATE"
          value={
            <Flex direction="column">
              <Select
                size="xs"
                mb={1}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                value={selectedYear}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>

              <Select
                size="xs"
                mb={1}
                onChange={(e) => {
                  const month = parseInt(e.target.value);
                  setSelectedMonth(month);
                  if (month === 0) setSelectedDay(0);
                }}
                value={selectedMonth}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Select>
            </Flex>
          }
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon
                  w="32px"
                  h="32px"
                  as={MdCalendarToday}
                  color={brandColor}
                />
              }
            />
          }
          name="Filtre appliqué"
          value={
            <Flex direction="column" gap="2">
              <Select
                size="xs"
                mt="2"
                isDisabled={selectedMonth === 0}
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                value={selectedDay}
              >
                {daysInMonth.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </Select>
              <Text>{formatDateDisplay()}</Text>
            </Flex>
          }
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
          // Ajoutez ces nouvelles props
          yearFilter={selectedYear}
          monthFilter={selectedMonth}
          dayFilter={selectedDay}
        />

        <WeeklyRevenue />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <PointGraphSuivi
          columnsData={columnsDataCheck}
          tableData={tableDataCheck}
        />
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

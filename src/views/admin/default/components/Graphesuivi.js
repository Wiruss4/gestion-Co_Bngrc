'use client';

import { useState, useEffect } from 'react';
import { Box, Select, useToast, useColorModeValue, Flex, Text } from '@chakra-ui/react';
import LineChart from 'components/charts/LineChart';
import axios from 'axios';
import Card from 'components/card/Card';

export default function TotalSpent({ selectedSite, onPointSelect, yearFilter, monthFilter, dayFilter }) {
  const [type, setType] = useState('personnes');
  const [stats, setStats] = useState({ historique: [], nombre_actuel: 0, nombre_max: 0 });
  const toast = useToast();

  useEffect(() => {
    if (selectedSite) {
      let date = `${yearFilter}-01-01`;
      if (monthFilter > 0) {
        date = `${yearFilter}-${monthFilter.toString().padStart(2, '0')}-01`;
      }
      if (dayFilter > 0) {
        date = `${yearFilter}-${monthFilter.toString().padStart(2, '0')}-${dayFilter.toString().padStart(2, '0')}`;
      }

      let periode = dayFilter > 0 ? 'day' : monthFilter > 0 ? 'month' : 'year';

      axios
        .get('http://localhost:4000/api/stats/suivi-site', {
          params: { id_site: selectedSite, type, date, periode },
        })
        .then((res) => setStats(res.data))
        .catch((err) => toast({ title: 'Erreur chargement données', status: 'error' }));
    }
  }, [selectedSite, type, yearFilter, monthFilter, dayFilter, toast]);

  const lineChartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: true },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const pointDetails = stats.historique[config.dataPointIndex];
          onPointSelect(pointDetails);
        },
      },
    },
    xaxis: {
      categories: stats.historique.map(h => h.date || h.heure_suivi),
    },
    stroke: { curve: 'smooth' },
  };

  return (
    <Card p="20px">
      <Flex justify="space-between" mb="20px">
        <Select w="150px" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="personnes">Personnes</option>
          <option value="menages">Ménages</option>
        </Select>

        <Box>
          <Text fontSize="sm" color="gray.500">
            {dayFilter > 0
              ? `Jour: ${dayFilter}/${monthFilter}/${yearFilter}`
              : monthFilter > 0
              ? `Mois: ${monthFilter}/${yearFilter}`
              : `Année: ${yearFilter}`}
          </Text>
        </Box>
      </Flex>

      <Box mt="4">
        <Text fontSize="3xl">{stats.nombre_actuel}</Text>
        <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
          Max : {stats.nombre_max}
        </Text>

        <LineChart
          chartData={[{ name: type, data: stats.historique.map(h => h.nombre) }]}
          chartOptions={lineChartOptions}
        />
      </Box>
    </Card>
  );
}

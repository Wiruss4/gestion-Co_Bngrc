'use client';

import { useState, useEffect } from 'react';
import {
  Box, Button, Select, useToast, useColorModeValue, Flex, Text, useDisclosure
} from '@chakra-ui/react';
import LineChart from 'components/charts/LineChart';
import MiniCalendar from 'components/calendar/MiniCalendar';
import axios from 'axios';
import Card from 'components/card/Card';

export default function TotalSpent({ selectedSite, onPointSelect }) {
  const [type, setType] = useState('personnes');
  const [date, setDate] = useState(new Date());
  const [periode, setPeriode] = useState('month');
  const [stats, setStats] = useState({ historique: [], nombre_actuel: 0, nombre_max: 0 });
  const { isOpen, onToggle, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (selectedSite) {
      axios.get('http://localhost:4000/api/stats/suivi-site', {
        params: {
          id_site: selectedSite,
          type,
          date: date.toISOString().slice(0, 10),
          periode,
        },
      })
        .then(res => setStats(res.data))
        .catch(err => toast({ title: 'Erreur chargement données', status: 'error' }));
    }
  }, [selectedSite, type, date, periode, toast]);

  const lineChartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: true },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const pointDetails = stats.historique[config.dataPointIndex];
          onPointSelect(pointDetails);
        }
      }
    },
    xaxis: {
      categories: stats.historique.map(h => periode === 'month' ? h.date : h.heure_suivi)
    },
    stroke: { curve: 'smooth' },
  };

  return (
    <Card p="20px">
      <Flex justify="space-between" mb="20px" position="relative">
        <Select w="150px" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="personnes">Personnes</option>
          <option value="menages">Ménages</option>
        </Select>

        <Box position="relative">
          <Button onClick={onToggle}>
            {periode === 'month' ? 'This Month' : date.toLocaleDateString()}
          </Button>

          {isOpen && (
            <Box position="absolute" top="100%" right={0} zIndex="999">
              <MiniCalendar
                selectRange={false}
                onChange={(value) => {
                  setDate(value);
                  setPeriode(value instanceof Date ? 'day' : 'month');
                  onClose();
                }}
              />
            </Box>
          )}
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

'use client';
/* eslint-disable */

import {
  Button,
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Select,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Custom components
import Card from 'components/card/Card';

const columnHelper = createColumnHelper();

export default function ComplexTable() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // 🔹 États pour les filtres
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // 🔥 Récupérer les données des localisations
  useEffect(() => {
    axios
      .get('http://localhost:4000/api/localisation-stats')
      .then((response) => {
        setData(response.data);

        // 🔹 Extraire les régions uniques
        const uniqueRegions = [...new Set(response.data.map((item) => item.nom_region))];
        setRegions(uniqueRegions);

        // 🔥 Récupérer les valeurs enregistrées dans localStorage
        const savedRegion = localStorage.getItem('selectedRegion');
        const savedDistrict = localStorage.getItem('selectedDistrict');

        if (savedRegion) {
          setSelectedRegion(savedRegion);
        }
        if (savedDistrict) {
          setSelectedDistrict(savedDistrict);
        }
      })
      .catch((error) => console.error('Erreur API :', error));
  }, []);

  // 🔥 Mettre à jour les districts lorsqu'une région est sélectionnée
  useEffect(() => {
    if (selectedRegion) {
      axios
        .get(`http://localhost:4000/api/localisation-stats?region=${selectedRegion}`)
        .then((response) => {
          const uniqueDistricts = [...new Set(response.data.map((item) => item.nom_district))];
          setDistricts(uniqueDistricts);
        })
        .catch((error) => console.error('Erreur API (Districts) :', error));
    } else {
      setDistricts([]); // Réinitialiser si aucune région sélectionnée
    }
  }, [selectedRegion]);

  // 🔥 Mettre à jour les données filtrées
  useEffect(() => {
    let url = 'http://localhost:4000/api/localisation-stats';
    const params = new URLSearchParams();

    if (selectedRegion) params.append('region', selectedRegion);
    if (selectedDistrict) params.append('district', selectedDistrict);

    axios
      .get(`${url}?${params.toString()}`)
      .then((response) => setData(response.data))
      .catch((error) => console.error('Erreur API (Filtrage) :', error));
  }, [selectedRegion, selectedDistrict]);

  // ✅ Fonction pour gérer la sélection d'une région
  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedDistrict(''); // Réinitialiser le district

    // ✅ Enregistrer dans localStorage
    localStorage.setItem('selectedRegion', region);
    localStorage.removeItem('selectedDistrict'); // Supprimer le district enregistré
  };

  // ✅ Fonction pour gérer la sélection d'un district
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);

    // ✅ Enregistrer dans localStorage
    localStorage.setItem('selectedDistrict', district);
  };

  const columns = [
    columnHelper.accessor('nom_district', {
      id: 'district',
      header: () => <Text color="gray.400">District</Text>,
      cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('nom_commune', {
      id: 'commune',
      header: () => <Text color="gray.400">COMMUNE</Text>,
      cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('nom_fokontany', {
      id: 'fokontany',
      header: () => <Text color="gray.400">FOKONTANY</Text>,
      cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('population', {
      id: 'population',
      header: () => <Text color="gray.400">POPULATION</Text>,
      cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('menages', {
      id: 'menages',
      header: () => <Text color="gray.400">MENAGE</Text>,
      cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card w="100%" px="0px">
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="30px" fontWeight="700">
          GESTION DE DATA
        </Text>

        <Flex align="center" gap="10px">
          <Button w="140px" minW="140px" variant="brand" fontWeight="500">
            Import DATA
          </Button>

          {/* 🔥 Select Région */}
          <Select fontSize="sm" variant="subtle" fontWeight="700" value={selectedRegion} onChange={handleRegionChange}>
            <option value="">Sélectionner une Région</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </Select>

          {/* 🔥 Select District */}
          <Select fontSize="sm" variant="subtle" fontWeight="700" value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedRegion}>
            <option value="">Tous les districts</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </Select>
        </Flex>
      </Flex>

      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} borderColor={borderColor}>
                    <Flex justifyContent="space-between" align="center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.slice(0, 11).map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id} borderColor="transparent">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}

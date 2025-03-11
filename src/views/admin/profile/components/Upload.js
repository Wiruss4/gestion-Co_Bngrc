// frontend/src/views/admin/profile/components/Upload.js

'use client';

import {
  Box, Flex, Input, Table, Thead, Tbody, Tr, Th, Td,
  Button, useColorModeValue, Checkbox
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Card from 'components/card/Card';
import UploadAjoutPopup from './UploadAjoutPopup';


const columnHelper = createColumnHelper();

export default function Upload() {
  const [sites, setSites] = useState([]);
  const [besoins, setBesoins] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSites, setFilteredSites] = useState([]);
  const [selectedBesoins, setSelectedBesoins] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  useEffect(() => {
    axios.get('http://localhost:4000/api/site-hebergement')
      .then((res) => {
        setSites(res.data);
        setFilteredSites(res.data);
      })
      .catch((err) => console.error('Erreur chargement sites:', err));
  }, []);

  useEffect(() => {
    if (selectedSite) {
      axios.get(`http://localhost:4000/api/besoins-site?id_site=${selectedSite}`)
        .then((res) => setBesoins(res.data))
        .catch((err) => console.error('Erreur chargement besoins:', err));
    } else {
      setBesoins([]);
    }
  }, [selectedSite]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = sites.filter(site =>
        site.nom_site.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSites(filtered);
    } else {
      setFilteredSites(sites);
    }
  }, [searchTerm, sites]);

  // ✅ Gestion de la sélection des besoins
  const toggleSelection = (id_besoin) => {
    setSelectedBesoins((prevSelected) =>
      prevSelected.includes(id_besoin)
        ? prevSelected.filter((id) => id !== id_besoin)
        : [...prevSelected, id_besoin]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBesoins.length === besoins.length) {
      setSelectedBesoins([]);
    } else {
      setSelectedBesoins(besoins.map(b => b.id_besoin));
    }
  };

  const columns = [
    columnHelper.display({
      id: 'select',
      header: () => (
        <Checkbox
          isChecked={selectedBesoins.length === besoins.length && besoins.length > 0}
          onChange={toggleSelectAll}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          isChecked={selectedBesoins.includes(row.original.id_besoin)}
          onChange={() => toggleSelection(row.original.id_besoin)}
        />
      ),
    }),
    columnHelper.accessor('nom_secteur', { header: 'Secteur' }),
    columnHelper.accessor('nom_sous_secteur', { header: 'Sous-secteur' }),
    columnHelper.accessor('nom_nature', { header: 'Nature' }),
    columnHelper.accessor('nom_type', { header: 'Type' }),
    columnHelper.accessor('quantite', { header: 'Quantité' }),
    columnHelper.accessor('etat', {
      header: 'État',
      cell: (info) => info.getValue() ? '✅ Besoin' : '❌ Aucun besoin',
    }),
  ];

  const table = useReactTable({
    data: besoins,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card p="25px">
      <Flex justify="space-between" align="center" mb="20px" gap="10px">
        <Box position="relative" w="300px">
          <Input
            placeholder="Rechercher un site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Box position="absolute" bg="white" boxShadow="md" zIndex="999" w="100%">
              {filteredSites.map(site => (
                <Box
                  key={site.id_site}
                  p="10px"
                  cursor="pointer"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => {
                    setSelectedSite(site.id_site);
                    setSearchTerm(site.nom_site);
                    setFilteredSites([]);
                  }}
                >
                  {site.nom_site}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Flex gap="10px">
        <Button variant="brand" onClick={() => setIsPopupOpen(true)}>Ajouter Besoin</Button>

          <Button
            variant="outline"
            colorScheme="blue"
            isDisabled={selectedBesoins.length !== 1} // Un seul élément sélectionné
          >
            Modifier
          </Button>
          <Button
            variant="outline"
            colorScheme="red"
            isDisabled={selectedBesoins.length === 0} // Au moins un élément sélectionné
          >
            Supprimer
          </Button>
        </Flex>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple" color={textColor}>
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id} borderColor={borderColor}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {besoins.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <Tr key={row.original.id_besoin}>
                  {row.getVisibleCells().map(cell => (
                    <Td key={cell.id} borderColor={borderColor}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length} textAlign="center">
                  Aucun besoin disponible.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      <UploadAjoutPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} idSite={selectedSite} />

    </Card>
    
  );
}

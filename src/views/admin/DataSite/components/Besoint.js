'use client';

import {
  Box, Flex, Input, Table, Thead, Tbody, Tr, Th, Td,
  Button, useColorModeValue, Checkbox, useToast, Text
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Card from 'components/card/Card';
import BesointAjoutPopup from './BesointAjoutPopup';
import BesointModifierPopup from './BesointModifierPopup';

const columnHelper = createColumnHelper();

export default function Besoint() {
  const [sites, setSites] = useState([]);
  const [besoins, setBesoins] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSites, setFilteredSites] = useState([]);
  const [selectedBesoins, setSelectedBesoins] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupModifierOpen, setIsPopupModifierOpen] = useState(false);

  const toast = useToast();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const suggestionBg = useColorModeValue('white', 'gray.700');
  const suggestionTextColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    axios.get('http://localhost:4000/api/site-hebergement').then(res => {
      setSites(res.data);
      setFilteredSites(res.data);

      for (const site of res.data) {
        axios.get(`http://localhost:4000/api/besoins-site?id_site=${site.id_site}`).then(besoinsRes => {
          if (besoinsRes.data.length > 0) {
            setSelectedSite(site.id_site);
            setSearchTerm(site.nom_site);
            setBesoins(besoinsRes.data);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (selectedSite) {
      axios.get(`http://localhost:4000/api/besoins-site?id_site=${selectedSite}`).then(res => setBesoins(res.data));
    } else {
      setBesoins([]);
    }
  }, [selectedSite]);

  useEffect(() => {
    setFilteredSites(searchTerm
      ? sites.filter(site => site.nom_site.toLowerCase().includes(searchTerm.toLowerCase()))
      : sites
    );
  }, [searchTerm, sites]);

  const toggleSelection = (id_besoin) => {
    setSelectedBesoins(prev =>
      prev.includes(id_besoin)
        ? prev.filter(id => id !== id_besoin)
        : [...prev, id_besoin]
    );
  };

  const toggleSelectAll = () => {
    setSelectedBesoins(selectedBesoins.length === besoins.length ? [] : besoins.map(b => b.id_besoin));
  };

  // ✅ Handler suppression
  const handleDelete = () => {
    if (window.confirm('Confirmer la suppression des besoins sélectionnés ?')) {
      Promise.all(selectedBesoins.map(id =>
        axios.delete(`http://localhost:4000/api/besoins-site/${id}`)
      )).then(() => {
        toast({ title: 'Succès', description: 'Besoin(s) supprimé(s).', status: 'success' });
        axios.get(`http://localhost:4000/api/besoins-site?id_site=${selectedSite}`).then(res => setBesoins(res.data));
        setSelectedBesoins([]);
      }).catch(err => {
        console.error(err);
        toast({ title: 'Erreur', description: 'Erreur lors de la suppression.', status: 'error' });
      });
    }
  };

  const columns = [
    columnHelper.display({
      id: 'select',
      header: () => (<Checkbox isChecked={selectedBesoins.length === besoins.length && besoins.length > 0} onChange={toggleSelectAll} />),
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
      cell: info => info.getValue() ? '✅ Besoin' : '❌ Aucun besoin',
    }),
  ];

  const table = useReactTable({ data: besoins, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <Card p="25px">
       <Flex flex="0" justify="left" align="center" mb="20px">
          <Text color={textColor} fontSize="30px" fontWeight="700">
            BESOINTS
          </Text>
        </Flex>
      <Flex justify="space-between" align="center" mb="20px" gap="10px">
        <Box position="relative" w="300px">
          <Input placeholder="Rechercher un site..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          {searchTerm && (
            <Box position="absolute" bg={suggestionBg} boxShadow="md" zIndex="999" w="100%">
              {filteredSites.map(site => (
                <Box
                  key={site.id_site}
                  p="10px"
                  cursor="pointer"
                  color={suggestionTextColor}
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
          <Button variant="brand" onClick={() => setIsPopupOpen(true)}>
            Ajouter Besoin
          </Button>
          <Button variant="outline" colorScheme="blue" isDisabled={selectedBesoins.length !== 1} onClick={() => setIsPopupModifierOpen(true)}>
            Modifier
          </Button>
          <Button variant="outline" colorScheme="red" isDisabled={selectedBesoins.length === 0} onClick={handleDelete}>
            Supprimer
          </Button>
        </Flex>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple" color={textColor}>
          <Thead>{table.getHeaderGroups().map(hg => (<Tr key={hg.id}>{hg.headers.map(h => (<Th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</Th>))}</Tr>))}</Thead>
          <Tbody>{table.getRowModel().rows.map(r => (<Tr key={r.id}>{r.getVisibleCells().map(c => (<Td key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</Td>))}</Tr>))}</Tbody>
        </Table>
      </Box>

      <BesointAjoutPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} idSite={selectedSite} />
      <BesointModifierPopup isOpen={isPopupModifierOpen} onClose={() => setIsPopupModifierOpen(false)} idBesoin={selectedBesoins[0]} refreshData={() => axios.get(`http://localhost:4000/api/besoins-site?id_site=${selectedSite}`).then(res => setBesoins(res.data))} />
    </Card>
  );
}

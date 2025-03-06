/* eslint-disable */
import {
  Flex,
  Box,
  Table,
  Checkbox,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Button,
  Tr,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import * as React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import Card from 'components/card/Card';

const columnHelper = createColumnHelper();

export default function CheckTable() {
  const [regions, setRegions] = useState([]); // Stocker les régions récupérées
  const [sorting, setSorting] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]); // Stocker les régions cochées
  const [pageIndex, setPageIndex] = useState(0);
  const rowsPerPage = 15; // Nombre de lignes affichées par page

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // ✅ Gestion des modales (popups)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  // ✅ Charger la liste des régions au montage
  useEffect(() => {
    fetch('http://localhost:4000/api/localisation-stats/regions')
      .then((response) => response.json())
      .then((data) => setRegions(data))
      .catch((error) => console.error('❌ Erreur lors du chargement des régions :', error));
  }, []);

  // ✅ Gestion des cases à cocher
  const toggleRegionSelection = (regionName) => {
    setSelectedRegions((prev) =>
      prev.includes(regionName)
        ? prev.filter((region) => region !== regionName)
        : [...prev, regionName]
    );
  };

  // ✅ Définition des colonnes
  const columns = [
    columnHelper.accessor('nom_region', {
      id: 'nom_region',
      header: () => <Text fontSize="12px" color="gray.re400">RÉGION</Text>,
      cell: (info) => (
        <Flex align="center">
          <Checkbox
            isChecked={selectedRegions.includes(info.getValue())}
            onChange={() => toggleRegionSelection(info.getValue())}
            colorScheme="brandScheme"
            me="10px"
          />
          <Text color="gray.re400" fontSize="sm" fontWeight="700">{info.getValue()}</Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('nb_districts', {
      id: 'nb_districts',
      header: () => <Text fontSize="12px" color="gray.400">NB DISTRICT</Text>,
      cell: (info) => <Text fontSize="sm" fontWeight="700">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('nb_communes', {
      id: 'nb_communes',
      header: () => <Text fontSize="12px" color="gray.400">NB COMMUNE</Text>,
      cell: (info) => <Text fontSize="sm" fontWeight="700">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('nb_fokontany', {
      id: 'nb_fokontany',
      header: () => <Text fontSize="12px" color="gray.400">NB FOKONTANY</Text>,
      cell: (info) => <Text fontSize="sm" fontWeight="700">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('population_total', {
      id: 'population_total',
      header: () => <Text fontSize="12px" color="gray.400">POPULATION</Text>,
      cell: (info) => <Text fontSize="sm" fontWeight="700">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('menage_total', {
      id: 'menage_total',
      header: () => <Text fontSize="12px" color="gray.400">MÉNAGE</Text>,
      cell: (info) => <Text fontSize="sm" fontWeight="700">{info.getValue()}</Text>,
    }),
  ];

  const table = useReactTable({
    data: regions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // ✅ Gestion des pages
  const nextPage = () => {
    if (pageIndex + rowsPerPage < regions.length) {
      setPageIndex(pageIndex + rowsPerPage);
    }
  };

  const prevPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - rowsPerPage);
    }
  };
// // ✅ Suppression des régions sélectionnées
// const handleDeleteRegions = async () => {
//   if (selectedRegions.length === 0) {
//     setModalMessage("Veuillez sélectionner au moins une région à supprimer.");
//     setConfirmAction(null);
//     onOpen();
//     return;
//   }

//   setModalMessage(`Voulez-vous vraiment supprimer ces ${selectedRegions.length} régions et leurs données associées ?`);
//   setConfirmAction(() => deleteSelectedRegions);
//   onOpen();
// };
  // ✅ Suppression des régions sélectionnées
  const handleDeleteRegions = async () => {
    if (selectedRegions.length === 0) {
      setModalMessage("Veuillez sélectionner au moins une région à supprimer.");
      setConfirmAction(null);
      onOpen();
      return;
    }
  
    // ✅ Demande de confirmation avant suppression
    setModalMessage(`Voulez-vous vraiment supprimer ces ${selectedRegions.length} régions et toutes leurs données associées ?`);
    setConfirmAction(() => deleteSelectedRegions);
    onOpen();
  };
  
  const deleteSelectedRegions = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/localisation-stats/deleteRegions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regionNames: selectedRegions }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setModalMessage(result.message);
        setRegions((prevData) => prevData.filter((row) => !selectedRegions.includes(row.nom_region)));
        setSelectedRegions([]);
      } else {
        setModalMessage(result.error);
      }
  
      setConfirmAction(null);
      onOpen();
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      setModalMessage("Une erreur est survenue.");
      setConfirmAction(null);
      onOpen();
    }
  };
  

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" mb="4px" fontWeight="700" lineHeight="100%">
          LISTE DES RÉGIONS   {regions.length}
        </Text>
        <Button w="240px" minW="140px" variant="brand" fontWeight="500" cursor="pointer" onClick={handleDeleteRegions}>
          SUPPRIMER LA RÉGION
        </Button>
         {/* ✅ Popup avec Chakra UI */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody>
            <Text>{modalMessage}</Text>
          </ModalBody>
          <ModalFooter>
            {confirmAction ? (
              <>
                <Button colorScheme="red" onClick={() => { confirmAction(); onClose(); }}>Confirmer</Button>
                <Button ml={3} onClick={onClose}>Annuler</Button>
              </>
            ) : (
              <Button onClick={onClose}>OK</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Flex>
      <Box>
      <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} borderColor={borderColor} cursor="pointer">
                    <Flex justifyContent="space-between" align="center" fontSize="12px" color="gray.400">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.slice(pageIndex, pageIndex + rowsPerPage).map((row) => (
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
      <Flex justifyContent="center" mt="10px" gap="20px">
        <Button onClick={prevPage} isDisabled={pageIndex === 0}>◀</Button>
        <Button onClick={nextPage} isDisabled={pageIndex + rowsPerPage >= regions.length}>▶</Button>
      </Flex>
    </Card>
  );
}

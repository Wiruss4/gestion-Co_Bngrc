// frontend/src/views/admin/profile/components/Storage.js
'use client';
/* eslint-disable */

// ✅ Import des composants Chakra UI
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
  useToast,
} from '@chakra-ui/react';

// ✅ Import de TanStack Table (gestion des tableaux)
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
// ✅ Import des hooks React
import { useEffect, useState, useRef } from 'react';
import { Checkbox } from '@chakra-ui/react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';

// ✅ Import d'Axios pour les appels API
import axios from 'axios';
import Card from 'components/card/Card'; // Composant pour l'affichage sous forme de carte

// ✅ Import de la popup d'ajout/modification de suivi
import StorageAjoutPopup from 'views/admin/profile/components/StorageAjoutPopup';

const columnHelper = createColumnHelper();

export default function SiteTable() {
  const toast = useToast();
  const [data, setData] = useState([]); // Données pour les filtres
  const [sites, setSites] = useState([]); // Liste des sites affichés
  const [selectedRows, setSelectedRows] = useState([]); // Sites sélectionnés pour suppression
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSiteToDelete, setSelectedSiteToDelete] = useState(null);
  const [isSitePopupOpen, setIsSitePopupOpen] = useState(false);
  const [selectedSiteData, setSelectedSiteData] = useState(null);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedFokontany, setSelectedFokontany] = useState('');

  const cancelRef = useRef(); // Pour la popup de suppression
  const [pageIndex, setPageIndex] = useState(0); // ✅ Ajout de l'état
  const rowsPerPage = 15; // ✅ Nombre de lignes par page
  const [sorting, setSorting] = useState([]); // 🔥 Gère le tri des colonnes

  // ✅ Style pour le mode clair/sombre
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
const [selectedSite, setSelectedSite] = useState(null); // Site sélectionné pour suppression


  

  // ✅ États pour la gestion de la popup d'ajout/modification
  const [selectedSitesites, setSelectedSitesites] = useState(null);

     // ✅ Charger toutes les données nécessaires pour les filtres
  useEffect(() => {
    axios
      .get('http://localhost:4000/api/suivi-site-hebergement-full')
      .then((response) => {
        console.log("📢 Données chargées :", response.data);
        setData(response.data);
      })
      .catch((error) => console.error('❌ Erreur API:', error));
  }, []);

    // ✅ Charger les sites en fonction des filtres sélectionnés
  useEffect(() => {
    let url = 'http://localhost:4000/api/site-hebergement';
    const params = new URLSearchParams();

    if (selectedRegion) params.append('region', selectedRegion);
    if (selectedDistrict) params.append('district', selectedDistrict);
    if (selectedCommune) params.append('commune', selectedCommune);
    if (selectedFokontany) params.append('fokontany', selectedFokontany);

    axios
      .get(`${url}?${params.toString()}`)
      .then((response) => {
        console.log("📢 Sites chargés :", response.data);
        setSites(response.data);
      })
      .catch((error) => console.error('❌ Erreur API Sites:', error));
  }, [selectedRegion, selectedDistrict, selectedCommune, selectedFokontany]);

     // ✅ Extraire les options des filtres
  const regions = [...new Set(data.map(item => item.nom_region))];
  const districts = selectedRegion ? [...new Set(data.filter(item => item.nom_region === selectedRegion).map(item => item.nom_district))] : [];
  const communes = selectedDistrict ? [...new Set(data.filter(item => item.nom_district === selectedDistrict).map(item => item.nom_commune))] : [];
  const fokontanys = selectedCommune ? [...new Set(data.filter(item => item.nom_commune === selectedCommune).map(item => item.nom_fokontany))] : [];



  // ✅ Filtrer les données des suivis selon les critères sélectionnés
  useEffect(() => {
    if (!selectedRegion && !selectedCommune && !selectedFokontany) {
      setSites([]);
      return;
    }

    let url = 'http://localhost:4000/api/suivi-site-hebergement-full';
    const params = new URLSearchParams();

    if (selectedRegion) params.append('region', selectedRegion);
    if (selectedCommune) params.append('commune', selectedCommune);
    if (selectedFokontany) params.append('fokontany', selectedFokontany);

    axios
      .get(`${url}?${params.toString()}`)
      .then((response) => {
        console.log('📢 Données API Suivi :', response.data);
        setSites(response.data);
      })
      .catch((error) => console.error('❌ Erreur API (Filtrage) :', error));
  }, [selectedRegion, selectedCommune, selectedFokontany]);

  // ✅ Gestion des sélections
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedDistrict('');
    setSelectedCommune('');
    setSelectedFokontany('');
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedCommune('');
    setSelectedFokontany('');
  };

  const handleCommuneChange = (e) => {
    setSelectedCommune(e.target.value);
    setSelectedFokontany('');
  };

  const handleFokontanyChange = (e) => {
    setSelectedFokontany(e.target.value);
  };


  // ✅ Fonction pour changer le site
  const handleSiteChange = (e) => {
    const site = e.target.value;
    setSelectedSite(site);
    localStorage.setItem('selectedSite', site);
  };

  // ✅ Fonction pour ouvrir la popup d'ajout de site
  const handleOpenSitePopup = () => {
    setIsSitePopupOpen(true);
  };

  // ✅ Fonction pour fermer la popup d'ajout de site
  const handleCloseSitePopup = () => {
    setIsSitePopupOpen(false);
  };

  // ✅ Fonction pour ouvrir la popup en mode modification d'un site
  const handleOpenEditSitePopup = (site) => {
    setSelectedSitesites(site); // Stocke les données du site sélectionné
    setIsSitePopupOpen(true); // Ouvre la popup
  };

  // ✅ Fonction pour ouvrir la popup de confirmation de suppression
  const handleOpenDeletePopup = () => {
    if (selectedRows.length === 1) {
      const siteToDelete = sites.find(
        (site) => site.id_site === selectedRows[0],
      );

      if (!siteToDelete) {
        console.error('❌ Site introuvable dans `sites` !');
        return;
      }

      console.log('🔹 Site sélectionné pour suppression :', siteToDelete);
      setSelectedSiteToDelete(siteToDelete);
      setIsDeleteOpen(true);
    }
  };

  const handleCloseDeletePopup = () => {
    setIsDeleteOpen(false); // 🔥 Ferme la popup
  };

  // ✅ Fonction pour supprimer un site
 // ✅ Suppression d'un site
 const handleDeleteSite = async () => {
  if (!selectedSiteToDelete) return;

  try {
    await axios.delete(`http://localhost:4000/api/site-hebergement/${selectedSiteToDelete.id_site}`);
    setSites(prev => prev.filter(site => site.id_site !== selectedSiteToDelete.id_site));
    toast({
      title: '✅ Site supprimé avec succès',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    toast({
      title: '❌ Erreur lors de la suppression',
      description: error.response?.data?.message || 'Une erreur est survenue',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }

  setIsDeleteOpen(false);
  setSelectedSiteToDelete(null);
};

  // ✅ Fonction pour cocher/décocher un suivi
  const toggleRowSelection = (siteId) => {
    setSelectedRows((prev) =>
      prev.includes(siteId)
        ? prev.filter((id) => id !== siteId)
        : [...prev, siteId],
    );
  };

  const columnHelper = createColumnHelper();

  const columns = [
    {
      id: 'select',
      header: () => (
        <Checkbox
          isChecked={selectedRows.length === sites.length && sites.length > 0}
          onChange={() =>
            setSelectedRows(
              selectedRows.length === sites.length
                ? []
                : sites.map((row) => row.id_site),
            )
          }
          colorScheme="brandScheme"
        />
      ),
      cell: (info) => (
        <Checkbox
          isChecked={selectedRows.includes(info.row.original.id_site)}
          onChange={() => toggleRowSelection(info.row.original.id_site)}
          colorScheme="brandScheme"
        />
      ),
    },
    columnHelper.accessor('nom_site', {
      id: 'nom_site',
      header: () => <Text color="gray.400">Nom du Site</Text>,
      cell: (info) => <Text fontWeight="700">{String(info.getValue())}</Text>,
    }),
    columnHelper.accessor('capacite', {
      id: 'capacite',
      header: () => <Text color="gray.400">Capacité</Text>,
      cell: (info) => <Text fontWeight="700">{Number(info.getValue())}</Text>,
    }),
    columnHelper.accessor('nom_type', {
      id: 'nom_type',
      header: () => <Text color="gray.400">Type de Site</Text>,
      cell: (info) => <Text fontWeight="700">{String(info.getValue())}</Text>,
    }),
  ];

  const table = useReactTable({
    data: sites, // ✅ Maintenant, on affiche les sites
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // 🔥 Gestion des flèches de navigation
  const nextPage = () => {
    if (pageIndex + rowsPerPage < sites.length) {
      setPageIndex(pageIndex + rowsPerPage);
    }
  };

  const prevPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - rowsPerPage);
    }
  };

  return (
    <Card w="100%" px="0px">
      {/* En-tête avec le titre et les boutons alignés */}
      <Flex
        px="25px"
        mb="8px"
        justifyContent="space-between"
        align="center"
        flexWrap="wrap"
        gap="10px"
      >
        {/* Titre centré */}
        <Flex flex="1" justify="center">
          <Text color={textColor} fontSize="30px" fontWeight="700">
            SITE D'HEBERGEMENT
          </Text>
        </Flex>

        {/* Boutons à droite */}
        <Flex gap="10px">
          <Button
            w="140px"
            minW="140px"
            variant="brand"
            fontWeight="500"
            cursor="pointer"
            onClick={handleOpenSitePopup} // ✅ Ouvre la popup d'ajout de site
          >
            AJOUT SITE
          </Button>

          <Button
            w="140px"
            minW="140px"
            variant="brand"
            fontWeight="500"
            cursor={selectedRows.length === 1 ? 'pointer' : 'not-allowed'}
            onClick={() => {
              if (selectedRows.length === 1) {
                const siteToEdit = sites.find(
                  (site) => site.id_site === selectedRows[0], // ✅ Recherche maintenant dans `sites`
                );
                handleOpenEditSitePopup(siteToEdit);
              }
            }}
            isDisabled={selectedRows.length !== 1} // Désactive si aucune ou plusieurs lignes sont sélectionnées
          >
            MODIFIER
          </Button>

          <Button
            w="140px"
            minW="140px"
            variant="brand"
            fontWeight="500"
            cursor={selectedRows.length === 0 ? 'not-allowed' : 'pointer'} // ✅ Désactive visuellement
            onClick={handleOpenDeletePopup} // ✅ Ouvre une popup au lieu d'un `window.confirm()`
            isDisabled={selectedRows.length === 0} // ✅ Désactivé si aucune ligne n'est sélectionnée
          >
            SUPPRIMER
          </Button>
        </Flex>
      </Flex>

      {/* Conteneur des sélections bien réparti */}
      <Flex align="center" wrap="wrap" justify="space-between" px="25px">
        <Flex direction="column" gap="10px">
          <Select fontSize="sm" variant="subtle" fontWeight="700" value={selectedRegion} onChange={handleRegionChange}>
            <option value="">Sélectionner une région</option>
            {regions.map((region, index) => <option key={index} value={region}>{region}</option>)}
          </Select>

          <Select fontSize="sm" variant="subtle" fontWeight="700" value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedRegion}>
            <option value="">Sélectionner un district</option>
            {districts.map((district, index) => <option key={index} value={district}>{district}</option>)}
          </Select>
        </Flex>

        <Flex direction="column" gap="10px">
          <Select fontSize="sm" variant="subtle" fontWeight="700" value={selectedCommune} onChange={handleCommuneChange} disabled={!selectedDistrict}>
            <option value="">Sélectionner une commune</option>
            {communes.map((commune, index) => <option key={index} value={commune}>{commune}</option>)}
          </Select>

          <Select fontSize="sm" variant="subtle" fontWeight="700" value={selectedFokontany} onChange={handleFokontanyChange} disabled={!selectedCommune}>
            <option value="">Sélectionner un fokontany</option>
            {fokontanys.map((fokontany, index) => <option key={index} value={fokontany}>{fokontany}</option>)}
          </Select>
        </Flex>
      </Flex>

      {/* Conteneur avec scroll horizontal */}
      <Box overflowX="auto">
        <Table
          variant="simple"
          color="gray.500"
          mb="24px"
          mt="12px"
          minWidth="600px"
        >
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} borderColor={borderColor}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table
              .getRowModel()
              .rows.slice(pageIndex, pageIndex + rowsPerPage)
              .map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} borderColor="transparent">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <Flex justifyContent="center" mt="10px" gap="20px">
        <Button onClick={prevPage} isDisabled={pageIndex === 0}>
          ◀
        </Button>
        <Button
          onClick={nextPage}
          isDisabled={pageIndex + rowsPerPage >= sites.length}
        >
          ▶
        </Button>
      </Flex>
      {/* ✅ Popup d'ajout/modification des suivis */}
      <StorageAjoutPopup
        isOpen={isSitePopupOpen}
        onClose={handleCloseSitePopup}
        selectedSite={selectedSiteData} // ✅ Passe les données du site sélectionné
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)} // Ferme la popup
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmation de suppression
            </AlertDialogHeader>

            <AlertDialogBody>
              {selectedSiteToDelete
                ? `Voulez-vous vraiment supprimer le site "${selectedSiteToDelete.nom_site}" ?`
                : 'Aucun site sélectionné.'}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={handleDeleteSite} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Card>
  );
}

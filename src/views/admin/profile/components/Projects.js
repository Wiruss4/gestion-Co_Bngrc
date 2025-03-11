// frontend/src/views/admin/profile/components/Projects.js
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
  Checkbox,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
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
import axios from 'axios';
import Card from 'components/card/Card';
import ProjectsAjoutPopup from "views/admin/profile/components/ProjectsAjoutPopup";

const columnHelper = createColumnHelper();

export default function SuiviSiteTable() {

  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [fokontanys, setFokontanys] = useState([]);
  const [sites, setSites] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState(localStorage.getItem("selectedRegion") || "ATSIMO ANDREFANA");
  const [selectedCommune, setSelectedCommune] = useState(localStorage.getItem("selectedCommune") || "");
  const [selectedFokontany, setSelectedFokontany] = useState(localStorage.getItem("selectedFokontany") || "");
  const [selectedSite, setSelectedSite] = useState(localStorage.getItem("selectedSite") || "");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const cancelRef = useRef();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedSuivi, setSelectedSuivi] = useState(null);

  const [pageIndex, setPageIndex] = useState(parseInt(localStorage.getItem("pageIndex")) || 0);
  const rowsPerPage = 15;

  const [refreshKey, setRefreshKey] = useState(0);
  
  
  // ✅ Récupérer les données des suivis des sites d'hébergement
  useEffect(() => {
    axios
      .get('http://localhost:4000/api/suivi-site-hebergement-full')
      .then((response) => {
        console.log("📢 Données API Suivi :", response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          // ✅ Vérifie que chaque élément a bien une `nom_region`
          const uniqueRegions = [...new Set(response.data
            .filter(item => item.nom_region) // 🔥 Évite les undefined
            .map(item => item.nom_region)
          )];
          setRegions(uniqueRegions);
        } else {
          console.error("❌ Aucune donnée valide reçue", response.data);
          setRegions([]);
        }
      })
      .catch((error) => {
        console.error('❌ Erreur API Suivi Site Hebergement:', error);
        setRegions([]);
      });
  }, []);

   // ✅ Recharger les données après une modification
   useEffect(() => {
    let url = 'http://localhost:4000/api/suivi-site-hebergement-full';
    const params = new URLSearchParams();

    params.append('region', selectedRegion);
    params.append('commune', selectedCommune);
    params.append('fokontany', selectedFokontany);

    axios.get(`${url}?${params.toString()}`)
      .then((response) => setData(response.data))
      .catch((error) => console.error('❌ Erreur API :', error));
  }, [selectedRegion, selectedCommune, selectedFokontany, refreshKey]);



  // ✅ Charger uniquement les communes de la région sélectionnée et qui ont des suivis
  useEffect(() => {
    if (selectedRegion) {
      axios
        .get(`http://localhost:4000/api/suivi-site-hebergement-full?region=${selectedRegion}`)
        .then((response) => {
          console.log("📢 Réponse API Communes :", response.data);
          const uniqueCommunes = [...new Set(response.data.map(item => item.nom_commune))];

          setCommunes(uniqueCommunes);
          setSelectedCommune(uniqueCommunes.length > 0 ? uniqueCommunes[0] : ""); // ✅ Sélectionne automatiquement la 1ère commune
          setSelectedFokontany(""); // ✅ Réinitialise le fokontany
          setSelectedSite(""); // ✅ Réinitialise le site
        })
        .catch((error) => console.error('❌ Erreur API Commune:', error));
    } else {
      setCommunes([]);
      setSelectedCommune("");
      setSelectedFokontany("");
      setSelectedSite("");
    }
  }, [selectedRegion]);




  // ✅ Charger uniquement les fokontany de la commune sélectionnée et qui ont des suivis
  useEffect(() => {
    if (selectedCommune) {
      axios
        .get(`http://localhost:4000/api/suivi-site-hebergement-full?commune=${selectedCommune}`)
        .then((response) => {
          console.log("📢 Fokontany avec des suivis :", response.data);
          const uniqueFokontanys = [...new Set(response.data.map(item => item.nom_fokontany))];
          setFokontanys(uniqueFokontanys);
        })
        .catch((error) => console.error('❌ Erreur API Fokontany:', error));
    } else {
      setFokontanys([]);
    }
  }, [selectedCommune]);


  // ✅ Charger uniquement les sites du fokontany sélectionné et qui ont des suivis
  useEffect(() => {
    if (selectedFokontany) {
      axios
        .get(`http://localhost:4000/api/suivi-site-hebergement-full?fokontany=${selectedFokontany}`)
        .then((response) => {
          console.log("📢 Sites avec des suivis :", response.data);
          const uniqueSites = [...new Set(response.data.map(item => item.nom_site))];
          setSites(uniqueSites);
        })
        .catch((error) => console.error('❌ Erreur API Site Hébergement:', error));
    } else {
      setSites([]);
    }
  }, [selectedFokontany]);


  // ✅ Filtrer les données des suivis selon les critères sélectionnés
  useEffect(() => {
    let url = 'http://localhost:4000/api/suivi-site-hebergement-full';
    const params = new URLSearchParams();

    params.append('region', selectedRegion);
    params.append('commune', selectedCommune);
    params.append('fokontany', selectedFokontany);

    // ✅ Vérifie si `selectedRegion`, `selectedCommune`, `selectedFokontany` sont valides avant d'appeler l'API
    if (selectedRegion || selectedCommune || selectedFokontany) {
      axios
        .get(`${url}?${params.toString()}`)
        .then((response) => {
          console.log("📢 Données API Suivi :", response.data);

          // ✅ Vérifie si `data` a vraiment changé avant de faire `setData`
          setData(prevData => {
            if (JSON.stringify(prevData) !== JSON.stringify(response.data)) {
              return response.data;
            }
            return prevData;
          });
        })
        .catch((error) => console.error('❌ Erreur API (Filtrage) :', error));
    }
  }, [selectedRegion, selectedCommune, selectedFokontany]); // 🔥 Se met à jour uniquement quand ces valeurs changent

  
  // ✅ Gestion des filtres (stockage dans localStorage)
  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedCommune('');
    setSelectedFokontany('');
    setSelectedSite('');
    localStorage.setItem('selectedRegion', region);
  };

  const handleCommuneChange = (e) => {
    const commune = e.target.value;
    setSelectedCommune(commune);
    setSelectedFokontany('');
    setSelectedSite('');
    localStorage.setItem('selectedCommune', commune);
  };

  const handleFokontanyChange = (e) => {
    const fokontany = e.target.value;
    setSelectedFokontany(fokontany);
    setSelectedSite('');
    localStorage.setItem('selectedFokontany', fokontany);
  };

  const handleSiteChange = (e) => {
    const site = e.target.value;
    setSelectedSite(site);
    localStorage.setItem('selectedSite', site);
  };


  // ✅ Fonction pour ouvrir la popup en mode "Ajout"
  const handleOpenPopupForAdd = () => {
    setSelectedSuivi(null); // Pas de données à modifier (mode ajout)
    setIsPopupOpen(true);
  };

  // ✅ Fonction pour ouvrir la popup en mode "Modification"
  const handleOpenPopupForEdit = (suivi) => {
    setSelectedSuivi(suivi); // On passe les données du suivi sélectionné
    setIsPopupOpen(true);
  };

  // ✅ Fonction pour fermer la popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedSuivi(null);
  };

  // ✅ Fonction pour supprimer les suivis sélectionnés
  const handleOpenDeletePopup = () => {
    if (selectedRows.length === 0) return;
    setIsDeleteOpen(true); // 🔥 Ouvre la popup de confirmation
  };

  const handleCloseDeletePopup = () => {
    setIsDeleteOpen(false); // 🔥 Ferme la popup
  };

   // ✅ Gestion de la suppression
   const handleDeleteSuivis = async () => {
    setIsDeleteOpen(false);
    try {
      await axios.delete("http://localhost:4000/api/suivi-site-hebergement-full", {
        data: { ids: selectedRows },
      });
      setSelectedRows([]);
      setRefreshKey((prev) => prev + 1); // 🔥 Actualiser la table
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
    }
  };

  // ✅ Fonction pour cocher/décocher un suivi
  const toggleRowSelection = (suiviId) => {
    setSelectedRows((prev) =>
      prev.includes(suiviId) ? prev.filter((id) => id !== suiviId) : [...prev, suiviId]
    );
  };


  const columns = [

    {
      id: "select",
      header: () => (
        <Checkbox
          isChecked={selectedRows.length === data.length && data.length > 0}
          onChange={() =>
            setSelectedRows(selectedRows.length === data.length ? [] : data.map((row) => row.id))
          }
          colorScheme="brandScheme"
        />
      ),
      cell: (info) => (
        <Checkbox
          isChecked={selectedRows.includes(info.row.original.id)}
          onChange={() => toggleRowSelection(info.row.original.id)}
          colorScheme="brandScheme"
        />
      ),
    },


    columnHelper.accessor('nom_site', {
      id: 'site',
      header: () => <Text color="gray.400">Site</Text>,
      cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('personnes_sinistrees_presentes', {
      id: 'sinistrees',
      header: () => <Text color="gray.400">Sinistrées</Text>,
      cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('menages', {
      id: 'menages',
      header: () => <Text color="gray.400">Ménages</Text>,
      cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('hommes', {
      id: 'hommes',
      header: () => <Text color="gray.400">Hommes</Text>,
      cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('femmes', {  // ✅ Correction ici
      id: 'femmes',
      header: () => <Text color="gray.400">Femmes</Text>,
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

  // ✅ Gestion de la pagination (stockage dans localStorage)
  const nextPage = () => {
    if (pageIndex + rowsPerPage < data.length) {
      setPageIndex((prev) => {
        localStorage.setItem("pageIndex", prev + rowsPerPage);
        return prev + rowsPerPage;
      });
    }
  };

  const prevPage = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => {
        localStorage.setItem("pageIndex", prev - rowsPerPage);
        return prev - rowsPerPage;
      });
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
            DATA SUIVI SITE D'HEBERGEMENT
          </Text>
        </Flex>

        {/* Boutons à droite */}
        <Flex gap="10px">
          <Button
            as="label"
            htmlFor="fileInput"
            w="140px"
            minW="140px"
            variant="brand"
            fontWeight="500"
            cursor="pointer"
            onClick={handleOpenPopupForAdd} // ✅ Ouvre la popup pour ajouter un suivi
          >
            AJOUT SITUATION
          </Button>

          <Button
            as="label"
            htmlFor="fileInput"
            w="140px"
            minW="140px"
            variant="brand"
            fontWeight="500"
            cursor={selectedRows.length === 1 ? "pointer" : "not-allowed"} // ✅ Bloque le curseur si désactivé
            onClick={() => {
              if (selectedRows.length === 1) { // ✅ Empêche d'exécuter la fonction si le bouton est désactivé
                handleOpenPopupForEdit(data.find((row) => row.id === selectedRows[0]));
              }
            }}
            isDisabled={selectedRows.length !== 1} // ✅ Active seulement si une ligne est sélectionnée
          >
            MODIFIER
          </Button>


          <Button
            w="140px"
            minW="140px"
            variant="brand"
            fontWeight="500"
            cursor={selectedRows.length === 0 ? "not-allowed" : "pointer"}
            onClick={handleOpenDeletePopup} // 🔥 Ouvre la popup au lieu d'un `window.confirm()`
            isDisabled={selectedRows.length === 0} // ✅ Désactivé si aucune ligne n'est sélectionnée
          >
            SUP SITUATION
          </Button>


        </Flex>
      </Flex>

      {/* Conteneur des sélections bien réparti */}
      <Flex align="center" wrap="wrap" justify="space-between" px="25px">
        {/* Sélections à gauche */}
        <Flex direction="column" gap="10px">
          {/* 🔥 Sélection de la Région */}
          <Select
            fontSize="sm"
            variant="subtle"
            fontWeight="700"
            color="black" // 🔥 Texte en noir
            value={selectedRegion}
            onChange={handleRegionChange}
          >
            <option value="">Sélectionner une région</option>
            {regions.length > 0 ? (
              regions.map((region, index) => (
                <option key={index} value={region} style={{ color: "black" }}> {/* Applique aussi sur chaque option */}
                  {region}
                </option>
              ))
            ) : (
              <option disabled style={{ color: "black" }}>Chargement...</option>
            )}
          </Select>

          {/* 🔥 Sélection de la Commune */}
          <Select fontSize="sm" variant="subtle" fontWeight="700" color="black"
            value={selectedCommune} onChange={handleCommuneChange} disabled={!selectedRegion}>
            <option value="">Sélectionner une commune</option>
            {communes.map((commune, index) => (
              <option key={index} value={commune} style={{ color: "black" }}>
                {commune}
              </option>
            ))}
          </Select>

        </Flex>

        {/* Sélections au centre */}
        <Flex direction="column" gap="10px">
          {/* 🔥 Sélection du Fokontany */}
          <Select fontSize="sm" variant="subtle" fontWeight="700" color="black"
            value={selectedFokontany} onChange={handleFokontanyChange} disabled={!selectedCommune}>
            <option value="">Sélectionner un fokontany</option>
            {fokontanys.map((fokontany, index) => (
              <option key={index} value={fokontany} style={{ color: "black" }}>
                {fokontany}
              </option>
            ))}
          </Select>


          {/* 🔥 Sélection du Site */}
          <Select
            fontSize="sm"
            variant="subtle"
            fontWeight="700"
            color="black"
            value={selectedSite}
            onChange={handleSiteChange}
            disabled={!selectedFokontany}
          >
            <option value="">Sélectionner un site</option>
            {sites.map((site, index) => (
              <option key={index} value={site} style={{ color: "black" }}>
                {site}
              </option>
            ))}
          </Select>

        </Flex>
      </Flex>


      {/* Conteneur avec scroll horizontal */}
      <Box overflowX="auto">
        <Table variant="simple" color="gray.500" mb="24px" mt="12px" minWidth="600px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} borderColor={borderColor}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
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

      {/* Pagination */}
      <Flex justifyContent="center" mt="10px" gap="20px">
        <Button onClick={prevPage} isDisabled={pageIndex === 0}>◀</Button>
        <Button onClick={nextPage} isDisabled={pageIndex + rowsPerPage >= data.length}>▶</Button>
      </Flex>
      {/* ✅ Popup d'ajout/modification des suivis */}
      <ProjectsAjoutPopup isOpen={isPopupOpen} onClose={handleClosePopup} selectedSuivi={selectedSuivi} />
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCloseDeletePopup}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmation de suppression
            </AlertDialogHeader>

            <AlertDialogBody>
              Voulez-vous vraiment supprimer ces {selectedRows.length} suivis ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCloseDeletePopup}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={handleDeleteSuivis} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

    </Card>

  );


}

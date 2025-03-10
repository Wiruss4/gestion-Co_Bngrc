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
import { Checkbox } from "@chakra-ui/react";
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";

// ✅ Import d'Axios pour les appels API
import axios from 'axios';
import Card from 'components/card/Card'; // Composant pour l'affichage sous forme de carte

// ✅ Import de la popup d'ajout/modification de suivi
import ProjectsAjoutPopup from "views/admin/profile/components/ProjectsAjoutPopup";

const columnHelper = createColumnHelper();

export default function SuiviSiteTable() {
  // ✅ Notification pour afficher les erreurs et succès
  const toast = useToast();
  // ✅ États pour stocker les données récupérées de l'API
  const [data, setData] = useState([]); // 🔥 Stocke les suivis des sites d'hébergement
  const [sorting, setSorting] = useState([]); // 🔥 Gère le tri des colonnes

  // ✅ États pour gérer la sélection des lignes
  const [selectedRows, setSelectedRows] = useState([]); // 🔥 Stocke les ID des suivis cochés

  // ✅ Style pour le mode clair/sombre
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // ✅ États pour la gestion des filtres (Région, Commune, Fokontany, Site)
  const [regions, setRegions] = useState([]); // 🔥 Liste des régions disponibles
  const [communes, setCommunes] = useState([]); // 🔥 Liste des communes en fonction de la région sélectionnée
  const [fokontanys, setFokontanys] = useState([]); // 🔥 Liste des fokontanys en fonction de la commune sélectionnée
  const [sites, setSites] = useState([]); // 🔥 Liste des sites d'hébergement disponibles

  // ✅ On sélectionne par défaut la région, la commune et le fokontany BETIOKY CENTRE (id: 8469)
  const [selectedRegion, setSelectedRegion] = useState("ATSIMO ANDREFANA"); // Région avec des suivis
  const [selectedCommune, setSelectedCommune] = useState(""); // Sélectionnera une commune plus tard
  const [selectedFokontany, setSelectedFokontany] = useState(""); // Sélectionnera un fokontany plus tard
  const [selectedSite, setSelectedSite] = useState(""); // Sélectionnera un site plus tard

  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // 🔥 Gère l'affichage de la popup
  const cancelRef = useRef(); // Référence pour le bouton "Annuler"

  // ✅ États pour la gestion de la popup d'ajout/modification
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 🔥 Contrôle l'ouverture de la popup
  const [selectedSuivi, setSelectedSuivi] = useState(null); // 🔥 Stocke les données du suivi sélectionné pour modification

  // ✅ États pour la pagination de la table
  const [pageIndex, setPageIndex] = useState(0); // 🔥 Page actuelle
  const rowsPerPage = 15; // 🔥 Nombre de lignes affichées par page

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

  // ✅ Gestion des filtres
  // ✅ Mettre à jour la région sélectionnée et réinitialiser les autres filtres
  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedCommune('');
    setSelectedFokontany('');
    setSelectedSite('');

    // 🔥 Sauvegarde dans localStorage pour garder la sélection
    localStorage.setItem('selectedRegion', region);
    localStorage.removeItem('selectedCommune');
    localStorage.removeItem('selectedFokontany');
    localStorage.removeItem('selectedSite');
  };

  // ✅ Mettre à jour la commune sélectionnée et réinitialiser les fokontany et sites
  const handleCommuneChange = (e) => {
    const commune = e.target.value;
    setSelectedCommune(commune);
    setSelectedFokontany('');
    setSelectedSite('');

    localStorage.setItem('selectedCommune', commune);
    localStorage.removeItem('selectedFokontany');
    localStorage.removeItem('selectedSite');
  };

  // ✅ Mettre à jour le fokontany sélectionné et réinitialiser les sites
  const handleFokontanyChange = (e) => {
    const fokontany = e.target.value;
    setSelectedFokontany(fokontany);
    setSelectedSite('');

    localStorage.setItem('selectedFokontany', fokontany);
    localStorage.removeItem('selectedSite');
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

  const handleDeleteSuivis = async () => {
    setIsDeleteOpen(false); // Ferme la popup après confirmation

    try {
      const response = await axios.delete("http://localhost:4000/api/suivi-site-hebergement-full", {
        data: { ids: selectedRows }, // 🔥 On envoie les ID des suivis à supprimer
      });

      if (response.data.success) {
        setData((prevData) => prevData.filter((row) => !selectedRows.includes(row.id)));
        setSelectedRows([]);
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
    }
  };


  // ✅ Mettre à jour le site sélectionné
  const handleSiteChange = (e) => {
    const site = e.target.value;
    setSelectedSite(site);

    localStorage.setItem('selectedSite', site);
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

    columnHelper.accessor("nom_site", {
      id: "site",
      header: () => <Text color="gray.400">Site</Text>,
      cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
    }),

    columnHelper.accessor("capacite", {
      id: "capacite",
      header: () => <Text color="gray.400">Capacité</Text>,
      cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
    }),

    columnHelper.accessor("type_site", {
      id: "type",
      header: () => <Text color="gray.400">Type de Site</Text>,
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

  // 🔥 Gestion des flèches de navigation
  const nextPage = () => {
    if (pageIndex + rowsPerPage < data.length) {
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
            as="label"
            htmlFor="fileInput"
            w="140px"
            minW="140px"
            variant="brand"
            fontWeight="500"
            cursor="pointer"
            onClick={handleOpenPopupForAdd} // ✅ Ouvre la popup pour ajouter un suivi
          >
            AJOUT SITE
          </Button>

          <Button
            w="140px"
            minW="140px"
            variant="brand"
            fontWeight="500"
            cursor={selectedRows.length === 1 ? "pointer" : "not-allowed"} // ✅ Désactive visuellement
            onClick={() => {
              if (selectedRows.length === 1) { // ✅ Vérifie avant d’exécuter la fonction
                handleOpenPopupForEdit(data.find((row) => row.id === selectedRows[0]));
              }
            }}
            isDisabled={selectedRows.length !== 1} // ✅ Active seulement si 1 ligne est sélectionnée
          >
            MODIFIER
          </Button>



          <Button
            w="140px"
            minW="140px"
            variant="brand"
            fontWeight="500"
            cursor={selectedRows.length === 0 ? "not-allowed" : "pointer"} // ✅ Désactive visuellement
            onClick={handleOpenDeletePopup} // ✅ Ouvre une popup au lieu d'un `window.confirm()`
            isDisabled={selectedRows.length === 0} // ✅ Désactivé si aucune ligne n'est sélectionnée
          >
            SUPPRIMER
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

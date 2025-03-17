// frontend/src/views/admin/DataSite/components/GestionSecteur.js

import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Table, Thead, Tbody, Tr, Th, Td, ButtonGroup,
  Button, Select, useToast, useColorModeValue,
  VStack, HStack, Heading, Divider
} from '@chakra-ui/react';
import axios from 'axios';
import GestionSecteurAjoutPopup from './GestionSecteurAjoutPopup';

import Card from 'components/card/Card';

export default function GestionSecteur() {
  const toast = useToast();

  // États COLONNE GAUCHE : Secteurs & Sous-secteurs
  const [secteurs, setSecteurs] = useState([]);
  const [sousSecteurs, setSousSecteurs] = useState([]);
  const [selectedSecteur, setSelectedSecteur] = useState('');

  // États COLONNE DROITE : Natures & Types de Besoins
  const [natures, setNatures] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedNatureRight, setSelectedNatureRight] = useState('');
  const [selectedSecteurRight, setSelectedSecteurRight] = useState('');
  const [sousSecteursRight, setSousSecteursRight] = useState([]);
  const [selectedSousSecteurRight, setSelectedSousSecteurRight] = useState('');

  // États communs pour les popups
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const fetchSecteurs = () => {
    axios.get('http://localhost:4000/api/secteurs')
      .then(res => setSecteurs(res.data))
      .catch(err => console.error('Erreur chargement secteurs:', err));
  };

  const fetchSousSecteurs = () => {
    if (selectedSecteur) {
      axios.get(`http://localhost:4000/api/sous-secteurs?id_secteur=${selectedSecteur}`)
        .then(res => setSousSecteurs(res.data))
        .catch(err => console.error('Erreur chargement sous-secteurs:', err));
    } else {
      setSousSecteurs([]);
    }
  };

  useEffect(() => {
    fetchSecteurs();
  }, [isPopupOpen]);

  useEffect(() => {
    fetchSousSecteurs();
  }, [selectedSecteur, isPopupOpen]); // Added isPopupOpen dependency for auto-refresh

  useEffect(() => {
    axios.get('http://localhost:4000/api/natures')
      .then(res => setNatures(res.data))
      .catch(err => console.error('Erreur chargement natures:', err));
  }, []);

  useEffect(() => {
    if (selectedSecteurRight) {
      axios.get(`http://localhost:4000/api/sous-secteurs?id_secteur=${selectedSecteurRight}`)
        .then(res => setSousSecteursRight(res.data))
        .catch(err => console.error('Erreur chargement sous-secteurs (right):', err));
    } else {
      setSousSecteursRight([]);
    }
  }, [selectedSecteurRight]);

  useEffect(() => {
    if (selectedSousSecteurRight && selectedNatureRight) {
      axios.get(`http://localhost:4000/api/types-besoin?id_nature=${selectedNatureRight}&id_sous_secteur=${selectedSousSecteurRight}`)
        .then(res => setTypes(res.data))
        .catch(err => console.error('Erreur chargement types:', err));
    } else {
      setTypes([]);
    }
  }, [selectedSousSecteurRight, selectedNatureRight]);

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer ce ${type} ?`)) return;
    let url = '';
    if (type === 'sous_secteur') {
      url = `http://localhost:4000/api/sous-secteurs/${id}`;
    } else if (type === 'type_besoin') {
      url = `http://localhost:4000/api/types-besoin/${id}`;
    } else {
      url = `http://localhost:4000/api/secteurs/${id}`;
    }
    try {
      await axios.delete(url);
      toast({
        title: "Suppression réussie",
        description: `${type} supprimé avec succès.`,
        status: "success",
        duration: 3000
      });
      if (type === "secteur") {
        fetchSecteurs();
      } else if (type === "sous_secteur") {
        fetchSousSecteurs();
      } else if (type === "type_besoin") {
        if (selectedSousSecteurRight && selectedNatureRight) {
          axios.get(`http://localhost:4000/api/types-besoin?id_nature=${selectedNatureRight}&id_sous_secteur=${selectedSousSecteurRight}`)
            .then(res => setTypes(res.data))
            .catch(err => console.error('Erreur chargement types:', err));
        }
      }
    } catch (err) {
      console.error("❌ Erreur suppression :", err);
      toast({
        title: "Erreur",
        description: `Impossible de supprimer ce ${type}.`,
        status: "error",
        duration: 3000
      });
    }
  };

  const openPopup = (type, id = null) => {
    setPopupType(type);
    setSelectedId(id);
    setIsPopupOpen(true);
  };

  return (
    <Card w="100%" px="0px">
      <Flex direction={{ base: "column", md: "row" }} gap="20px" p="2px">
        {/* COLONNE GAUCHE : Secteurs & Sous-secteurs */}
        <Card flex="1" borderRadius="lg" p="6">
          <VStack spacing="4" align="stretch">
            {/* En-tête Secteurs */}
            <Flex justifyContent="space-between" align="center" mb="4">
              <Heading size="md">Gestion des Secteurs</Heading>
              <Button
                variant="brand"
                w="140px"
                minW="140px"
                onClick={() => openPopup('secteur')}
              >
                Ajouter Secteur
              </Button>
            </Flex>

            <Box>
              <Table variant="simple" width="100%">
                <Thead>
                  <Tr>
                    <Th borderColor="gray.200">Secteur</Th>
                    <Th borderColor="gray.200">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {secteurs.map((secteur) => (
                    <Tr key={secteur.id_secteur}>
                      <Td borderColor="transparent">{secteur.nom_secteur}</Td>
                      <Td borderColor="transparent">
                        <HStack spacing="2">
                          <Button
                            size="sm"
                            variant="brand"
                            onClick={() => openPopup('secteur', secteur.id_secteur)}
                          >
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="brand"
                            colorScheme="red"
                            onClick={() => handleDelete(secteur.id_secteur, "secteur")}
                          >
                            Supprimer
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Divider my="4" />

            {/* En-tête Sous-secteurs */}
            <Flex direction="column" gap="10px">
              <Heading size="md" mb="2">Gestion des Sous-secteurs</Heading>

              <Select
                variant="subtle"
                fontWeight="700"
                color="black"
                placeholder="Sélectionner un secteur"
                onChange={e => setSelectedSecteur(e.target.value)}
              >
                {secteurs.map(secteur => (
                  <option key={secteur.id_secteur} value={secteur.id_secteur}>
                    {secteur.nom_secteur}
                  </option>
                ))}
              </Select>

              {selectedSecteur && (
                <VStack spacing="4" align="stretch">
                  <Flex justify="flex-end">
                    <Button
                      variant="brand"
                      w="160px"
                      minW="160px"
                      onClick={() => openPopup('sous_secteur')}
                    >
                      Add Sous-Secteur
                    </Button>
                  </Flex>

                  <Box>
                    <Table variant="simple" width="100%">
                      <Thead>
                        <Tr>
                          <Th borderColor="gray.200">Sous-Secteur</Th>
                          <Th borderColor="gray.200">Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {sousSecteurs.map(ss => (
                          <Tr key={ss.id_sous_secteur}>
                            <Td borderColor="transparent">{ss.nom_sous_secteur}</Td>
                            <Td borderColor="transparent">
                              <HStack spacing="2">
                                <Button
                                  size="sm"
                                  variant="brand"
                                  onClick={() => openPopup('sous_secteur', ss.id_sous_secteur)}
                                >
                                  Modifier
                                </Button>
                                <Button
                                  size="sm"
                                  variant="brand"
                                  colorScheme="red"
                                  onClick={() => handleDelete(ss.id_sous_secteur, "sous_secteur")}
                                >
                                  Supprimer
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </VStack>
              )}
            </Flex>
          </VStack>
        </Card>

        {/* COLONNE DROITE : Gestion des Types de Besoins */}
        <Card flex="1" borderRadius="lg" p="6">
          <VStack spacing="4" align="stretch">
            <Flex justifyContent="space-between" align="center" mb="4">
              <Heading size="md">Gestion des Types de Besoins</Heading>
              <Button
                variant="brand"
                w="160px"
                minW="160px"
                onClick={() => openPopup('type_besoin')}
              >
                Ajouter Type
              </Button>
            </Flex>

            <Flex direction="column" gap="10px">
              <Select
                variant="subtle"
                fontWeight="700"
                color="black"
                placeholder="Sélectionner une nature"
                onChange={e => setSelectedNatureRight(e.target.value)}
              >
                {natures.map(nature => (
                  <option key={nature.id_nature} value={nature.id_nature}>
                    {nature.nom_nature}
                  </option>
                ))}
              </Select>

              <Select
                variant="subtle"
                fontWeight="700"
                color="black"
                placeholder="Sélectionner un secteur"
                onChange={e => setSelectedSecteurRight(e.target.value)}
              >
                {secteurs.map(secteur => (
                  <option key={secteur.id_secteur} value={secteur.id_secteur}>
                    {secteur.nom_secteur}
                  </option>
                ))}
              </Select>

              <Select
                variant="subtle"
                fontWeight="700"
                color="black"
                placeholder="Sélectionner un sous-secteur"
                onChange={e => setSelectedSousSecteurRight(e.target.value)}
              >
                {sousSecteursRight.map(ss => (
                  <option key={ss.id_sous_secteur} value={ss.id_sous_secteur}>
                    {ss.nom_sous_secteur}
                  </option>
                ))}
              </Select>

              <Box>
                <Table variant="simple" width="100%">
                  <Thead>
                    <Tr>
                      <Th borderColor="gray.200">Type de Besoin</Th>
                      <Th borderColor="gray.200">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {types.map(type => (
                      <Tr key={type.id_type}>
                        <Td borderColor="transparent">{type.nom_type}</Td>
                        <Td borderColor="transparent">
                          <HStack spacing="2">
                            <Button
                              size="sm"
                              variant="brand"
                              onClick={() => openPopup('type_besoin', type.id_type)}
                            >
                              Modifier
                            </Button>
                            <Button
                              size="sm"
                              variant="brand"
                              colorScheme="red"
                              onClick={() => handleDelete(type.id_type, "type_besoin")}
                            >
                              Supprimer
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Flex>
          </VStack>
        </Card>
      </Flex>

      <GestionSecteurAjoutPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        type={popupType}
        id={selectedId}
        fetchTypes={() => {
          if (selectedSousSecteurRight && selectedNatureRight) {
            axios.get(`http://localhost:4000/api/types-besoin?id_nature=${selectedNatureRight}&id_sous_secteur=${selectedSousSecteurRight}`)
              .then(res => setTypes(res.data))
              .catch(err => console.error('Erreur chargement types:', err));
          }
        }}
        selectedSecteur={selectedSecteur}
        selectedNatureRight={selectedNatureRight}
        selectedSousSecteurRight={selectedSousSecteurRight}
      />
    </Card>
);
}
import React, { useState } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Spinner, useToast, Alert, AlertIcon, Box, Text
} from "@chakra-ui/react";

const ImportPopup = ({ open, onClose, importedData, regionExistante, handleConfirmImport }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleImport = async (replaceExisting) => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/population", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: importedData,
          replaceExisting: replaceExisting
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.statusText}`);
      }

      toast({
        title: "✅ Importation réussie !",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: "❌ Une erreur est survenue",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxH="90vh">  {/* ✅ Limite la hauteur à 90% de l'écran */}
        <ModalHeader>📁 Importation des données</ModalHeader>
        <ModalBody overflowY="auto" maxH="65vh">  {/* ✅ Ajout du défilement si trop de données */}
          {loading ? (
            <Box textAlign="center" py={5}>
              <Spinner size="xl" />
              <Text mt={2}>Importation en cours...</Text>
            </Box>
          ) : (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr bg="gray.100">
                    {/* <Th>Région</Th> */}
                    <Th>District</Th>
                    <Th>Commune</Th>
                    <Th>Fokontany</Th>
                    <Th>Population</Th>
                    <Th>Ménages</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {importedData.length === 0 ? (
                    <Tr>
                      <Td colSpan={6} textAlign="center">
                        <Alert status="warning">
                          <AlertIcon />
                          Aucune donnée à afficher.
                        </Alert>
                      </Td>
                    </Tr>
                  ) : (
                    importedData.map((row, index) => (
                      <Tr key={index}>
                        {/* <Td>{row.region}</Td> */}
                        <Td>{row.district}</Td>
                        <Td>{row.commune}</Td>
                        <Td>{row.fokontany}</Td>
                        <Td>{row.population.toLocaleString()}</Td>
                        <Td>{row.menages.toLocaleString()}</Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="gray" mr={3} isDisabled={loading}>
            Annuler
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => handleImport(regionExistante)}
            isLoading={loading}
          >
            {regionExistante ? "Écraser les données existantes" : "Confirmer l'importation"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImportPopup;

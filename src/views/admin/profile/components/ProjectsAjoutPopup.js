// frontend/src/views/admin/profile/components/ProjectsAjoutPopup.js
import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useToast } from "@chakra-ui/react";
import SuiviForm from "./SuiviForm";
import { addSuiviSiteHebergement, updateSuiviSiteHebergement } from "views/admin/profile/variables/Dataproject";

export default function ProjectsAjoutPopup({ isOpen, onClose, selectedSuivi }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // Gérer la soumission du formulaire
  const handleSubmit = async (formData) => {
    setLoading(true);
    let result;

    if (selectedSuivi) {
      result = await updateSuiviSiteHebergement(selectedSuivi.id, formData);
    } else {
      result = await addSuiviSiteHebergement(formData);
    }

    setLoading(false);

    if (result.success) {
      toast({ title: "✅ Suivi enregistré avec succès", status: "success", duration: 3000, isClosable: true });
      onClose();
    } else {
      toast({ title: "❌ Erreur lors de l'enregistrement", status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedSuivi ? "Modifier un suivi" : "Ajouter un suivi"}</ModalHeader>
        <ModalBody>
          <SuiviForm onSubmit={handleSubmit} initialData={selectedSuivi} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="red" mr="3">Annuler</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

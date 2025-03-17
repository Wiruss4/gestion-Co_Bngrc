// frontend/src/views/admin/profile/components/UploadModifierPopup.js

import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  Select, Button, Input, FormControl, FormLabel, useToast
} from '@chakra-ui/react';
import axios from 'axios';

const UploadModifierPopup = ({ isOpen, onClose, idBesoin, refreshData }) => {
  const toast = useToast();
  const [types, setTypes] = useState([]);
  const [idType, setIdType] = useState('');
  const [etat, setEtat] = useState(1);
  const [quantite, setQuantite] = useState(1);

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:4000/api/types-besoin')
        .then(res => setTypes(res.data))
        .catch(err => console.error('Erreur chargement types:', err));

      axios.get(`http://localhost:4000/api/besoins-site?id_besoin=${idBesoin}`)
        .then(res => {
          const besoin = res.data[0];
          setIdType(besoin.id_type);
          setEtat(besoin.etat);
          setQuantite(besoin.quantite);
        })
        .catch(err => console.error('Erreur chargement besoin:', err));
    }
  }, [isOpen, idBesoin]);

  const handleSubmit = () => {
    axios.put(`http://localhost:4000/api/besoins-site/${idBesoin}`, {
      id_type: idType, etat, quantite
    })
      .then(() => {
        toast({ title: 'Succès', description: 'Besoin modifié avec succès !', status: 'success' });
        refreshData();
        onClose();
      })
      .catch((error) => {
        toast({ title: 'Erreur', description: 'Erreur lors de la modification.', status: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modifier le besoin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Type de besoin</FormLabel>
            <Select value={idType} onChange={(e) => setIdType(e.target.value)}>
              {types.map(t => <option key={t.id_type} value={t.id_type}>{t.nom_type}</option>)}
            </Select>
          </FormControl>
  
          <FormControl mb={4}>
            <FormLabel>État</FormLabel>
            <Select value={etat} onChange={(e) => setEtat(parseInt(e.target.value))}>
              <option value="1">✅ Besoin</option>
              <option value="0">❌ Aucun besoin</option>
            </Select>
          </FormControl>
  
          <FormControl mb={4}>
            <FormLabel>Quantité</FormLabel>
            <Input type="number" value={quantite} min="1" onChange={(e) => setQuantite(parseInt(e.target.value))} />
          </FormControl>
  
          <Button colorScheme="blue" onClick={handleSubmit}>Modifier</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
  

};
export default UploadModifierPopup;

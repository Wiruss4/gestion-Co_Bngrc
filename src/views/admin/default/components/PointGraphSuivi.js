// frontend/src/views/admin/default/components/PointGraphSuivi.js
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

export default function CheckTable({ pointDetail }) {
  if (!pointDetail) return <p>Sélectionnez un point sur le graphique.</p>;

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Date</Th><Th>Heure</Th><Th>Ménages</Th><Th>Personnes présentes</Th><Th>Hommes</Th><Th>Femmes</Th><Th>Femmes enceintes</Th><Th>Enfants -5ans</Th><Th>Personnes âgées</Th><Th>Handicapés</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>{pointDetail.date_suivi}</Td>
          <Td>{pointDetail.heure_suivi}</Td>
          <Td>{pointDetail.menages}</Td>
          <Td>{pointDetail.personnes_sinistrees_presentes}</Td>
          <Td>{pointDetail.hommes}</Td>
          <Td>{pointDetail.femmes}</Td>
          <Td>{pointDetail.femmes_enceintes}</Td>
          <Td>{pointDetail.enfants_moins_5ans}</Td>
          <Td>{pointDetail.personnes_agees}</Td>
          <Td>{pointDetail.personnes_handicapees}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

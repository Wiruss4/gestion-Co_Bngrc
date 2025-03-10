// // frontend/src/views/admin/dataTables/components/DevelopmentTable.js
// 'use client';
// /* eslint-disable */

// import {
//   Button,
//   Box,
//   Flex,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   useColorModeValue,
//   Select,
//   useToast,
// } from '@chakra-ui/react';
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from '@tanstack/react-table';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import ImportPopup from "views/admin/dataTables/components/ImportPopup";
// import { handleImport } from "views/admin/dataTables/variables/imporDataDevelopment";



// // Custom components
// import Card from 'components/card/Card';

// const columnHelper = createColumnHelper();

// export default function ComplexTable() {
//   const toast = useToast();
//   const [data, setData] = useState([]);
//   const [sorting, setSorting] = useState([]);
//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

//   const [importDialogOpen, setImportDialogOpen] = useState(false);
//   const [importedData, setImportedData] = useState([]);
//   const [regionExistante, setRegionExistante] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleFileUpload = (event) => {
//     handleImport(event, toast, setImportedData, setImportDialogOpen, setRegionExistante, setLoading);
//   };

//   //   const resetAllData = () => {
//   //     setData([]);               // ✅ Réinitialiser les données de la table
//   //     setImportedData([]);       // ✅ Vider les données importées
//   //     setRegions([]);            // ✅ Réinitialiser la liste des régions
//   //     setDistricts([]);          // ✅ Réinitialiser la liste des districts
//   //     setSelectedRegion('');     // ✅ Désélectionner la région
//   //     setSelectedDistrict('');   // ✅ Désélectionner le district
//   //     setImportDialogOpen(false); // ✅ Fermer le popup d'importation
//   //     localStorage.clear();      // ✅ Effacer toutes les données stockées dans le navigateur
//   //     window.location.reload();  // 🔄 Recharger la page pour tout réinitialiser
//   //     const resetAllData = () => {
//   //       setData([]);  // ✅ Vide la table
//   //       axios.get('http://localhost:4000/api/localisation-stats')
//   //         .then((response) => {
//   //           setData(response.data);  // ✅ Recharge les données depuis l'API
//   //         })
//   //         .catch((error) => console.error('Erreur API :', error));
//   //     };
//   //     localStorage.clear();  // ✅ Effacer toutes les données locales
//   // sessionStorage.clear(); // ✅ Effacer toutes les sessions actives

//   //   };


//   // 🔹 États pour les filtres
//   const [regions, setRegions] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [selectedRegion, setSelectedRegion] = useState('');
//   const [selectedDistrict, setSelectedDistrict] = useState('');

//   // 🔹 États pour la pagination
//   const [pageIndex, setPageIndex] = useState(0);
//   const rowsPerPage = 15; // 🔥 Nombre de lignes affichées

//   // 🔥 Récupérer les données des localisations
//   useEffect(() => {
//     axios
//       .get('http://localhost:4000/api/localisation-stats')
//       .then((response) => {
//         setData(response.data);

//         const uniqueRegions = [...new Set(response.data.map((item) => item.nom_region))];
//         setRegions(uniqueRegions);

//         const savedRegion = localStorage.getItem('selectedRegion');
//         const savedDistrict = localStorage.getItem('selectedDistrict');

//         if (savedRegion) setSelectedRegion(savedRegion);
//         if (savedDistrict) setSelectedDistrict(savedDistrict);
//       })
//       .catch((error) => console.error('Erreur API :', error));
//   }, []);

//   // 🔥 Mettre à jour les districts lorsqu'une région est sélectionnée...
//   useEffect(() => {
//     if (selectedRegion) {
//       axios
//         .get(`http://localhost:4000/api/localisation-stats?region=${selectedRegion}`)
//         .then((response) => {
//           const uniqueDistricts = [...new Set(response.data.map((item) => item.nom_district))];
//           setDistricts(uniqueDistricts);
//         })
//         .catch((error) => console.error('Erreur API (Districts) :', error));
//     } else {
//       setDistricts([]);
//     }
//   }, [selectedRegion]);

//   // 🔥 Mettre à jour les données filtrées
//   useEffect(() => {
//     let url = 'http://localhost:4000/api/localisation-stats';
//     const params = new URLSearchParams();

//     if (selectedRegion) params.append('region', selectedRegion);
//     if (selectedDistrict) params.append('district', selectedDistrict);

//     axios
//       .get(`${url}?${params.toString()}`)
//       .then((response) => setData(response.data))
//       .catch((error) => console.error('Erreur API (Filtrage) :', error));
//   }, [selectedRegion, selectedDistrict]);

//   // ✅ Gestion des filtres
//   const handleRegionChange = (e) => {
//     const region = e.target.value;
//     setSelectedRegion(region);
//     setSelectedDistrict('');
//     localStorage.setItem('selectedRegion', region);
//     localStorage.removeItem('selectedDistrict');
//   };

//   const handleDistrictChange = (e) => {
//     const district = e.target.value;
//     setSelectedDistrict(district);
//     localStorage.setItem('selectedDistrict', district);
//   };

//   const columns = [
//     columnHelper.accessor('nom_district', {
//       id: 'district',
//       header: () => <Text color="gray.400">District</Text>,
//       cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
//     }),
//     columnHelper.accessor('nom_commune', {
//       id: 'commune',
//       header: () => <Text color="gray.400">COMMUNE</Text>,
//       cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
//     }),
//     columnHelper.accessor('nom_fokontany', {
//       id: 'fokontany',
//       header: () => <Text color="gray.400">FOKONTANY</Text>,
//       cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
//     }),
//     columnHelper.accessor('population', {
//       id: 'population',
//       header: () => <Text color="gray.400">POPULATION</Text>,
//       cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
//     }),
//     columnHelper.accessor('menages', {
//       id: 'menages',
//       header: () => <Text color="gray.400">MENAGE</Text>,
//       cell: (info) => <Text fontWeight="700">{info.getValue()}</Text>,
//     }),
//   ];

//   const table = useReactTable({
//     data,
//     columns,
//     state: { sorting },
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   // 🔥 Gestion des flèches de navigation
//   const nextPage = () => {
//     if (pageIndex + rowsPerPage < data.length) {
//       setPageIndex(pageIndex + rowsPerPage);
//     }
//   };

//   const prevPage = () => {
//     if (pageIndex > 0) {
//       setPageIndex(pageIndex - rowsPerPage);
//     }
//   };

//   return (
//     <Card w="100%" px="0px">
//       <Flex
//         px="25px"
//         mb="8px"
//         justifyContent="space-between"
//         align="center"
//         flexWrap="wrap"
//         gap="10px"
//       >
//         {/* Titre */}
//         <Text color={textColor} fontSize="30px" fontWeight="700">
//           REGION DE MADAGASCAR
//         </Text>
  
//         {/* Conteneur des sélections et du bouton Import */}
//         <Flex align="center" gap="10px" wrap="wrap">
//           {/* Empilement vertical des sélections */}
//           <Flex direction="column" gap="10px">
//             <Select
//               fontSize="sm"
//               variant="subtle"
//               fontWeight="700"
//               value={selectedRegion}
//               onChange={handleRegionChange}
//             >
//               <option value="">Région</option>
//               {regions.map((region) => (
//                 <option key={region} value={region}>
//                   {region}
//                 </option>
//               ))}
//             </Select>
  
//             <Select
//               fontSize="sm"
//               variant="subtle"
//               fontWeight="700"
//               value={selectedDistrict}
//               onChange={handleDistrictChange}
//               disabled={!selectedRegion}
//             >
//               <option value="">Tous les districts</option>
//               {districts.map((district) => (
//                 <option key={district} value={district}>
//                   {district}
//                 </option>
//               ))}
//             </Select>
//           </Flex>
  
//           {/* Bouton Import aligné à droite */}
//           <Button
//             as="label"
//             htmlFor="fileInput"
//             w="140px"
//             minW="140px"
//             variant="brand"
//             fontWeight="500"
//             cursor="pointer"
//             alignSelf="center"
//           >
//             Import DATA
//           </Button>
//           <input
//             id="fileInput"
//             type="file"
//             accept=".xlsx"
//             style={{ display: "none" }}
//             onChange={handleFileUpload}
//           />
  
//           <ImportPopup
//             open={importDialogOpen}
//             onClose={() => {
//               setImportDialogOpen(false);
//               setImportedData([]);
//             }}
//             importedData={importedData}
//             regionExistante={regionExistante}
//             handleConfirmImport={() => {
//               toast({
//                 title: "✅ Importation terminée !",
//                 status: "success",
//                 duration: 5000,
//                 isClosable: true,
//               });
//               setImportedData([]);
//               setImportDialogOpen(false);
//             }}
//           />
//         </Flex>
//       </Flex>
  
//       {/* Conteneur avec scroll horizontal */}
//       <Box overflowX="auto">
//         <Table variant="simple" color="gray.500" mb="24px" mt="12px" minWidth="600px">
//           <Thead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <Tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <Th key={header.id} borderColor={borderColor}>
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                   </Th>
//                 ))}
//               </Tr>
//             ))}
//           </Thead>
//           <Tbody>
//             {table.getRowModel().rows.slice(pageIndex, pageIndex + rowsPerPage).map((row) => (
//               <Tr key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <Td key={cell.id} borderColor="transparent">
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </Td>
//                 ))}
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
//       </Box>
  
//       {/* Pagination */}
//       <Flex justifyContent="center" mt="10px" gap="20px">
//         <Button onClick={prevPage} isDisabled={pageIndex === 0}>◀</Button>
//         <Button onClick={nextPage} isDisabled={pageIndex + rowsPerPage >= data.length}>▶</Button>
//       </Flex>
//     </Card>
//   );
  
  
// }

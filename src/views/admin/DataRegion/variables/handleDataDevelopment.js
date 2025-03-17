// frontend/src/views/admin/DataRegion/variables/handleDataDevelopment.js
import * as XLSX from "xlsx";
import { useToast } from "@chakra-ui/react";

// 📌 Vérifie si le fichier est valide et extrait la région
export const verifyFile = async (file) => {
  return new Promise((resolve, reject) => {
    const toast = useToast();
    const fileName = file.name;
    const regex = /^(.+?)_CoBngrc\.xlsx$/;
    const match = fileName.match(regex);

    if (!match) {
      toast({
        title: "❌ Nom de fichier invalide !",
        description: "Format attendu : 'NOM_DE_LA_REGION_CoBngrc.xlsx'",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return reject("Nom de fichier invalide");
    }

    const regionName = match[1]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

    fetch("http://localhost:4000/api/region")
      .then((res) => res.json())
      .then((regions) => {
        const regionExistante = regions.some(
          (r) => r.nom_region.toUpperCase().trim() === regionName.toUpperCase().trim()
        );

        resolve({ regionName, regionExistante });
      })
      .catch((error) => {
        toast({
          title: "❌ Erreur de connexion à l'API",
          description: "Impossible de récupérer les régions.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        reject("❌ Impossible de récupérer les régions !");
      });
  });
};

// 📌 Extrait les données du fichier Excel
export const extractDataFromXLSX = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (event) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });

      let allData = [];

      workbook.SheetNames.forEach((sheetName) => {
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        if (sheetData.length > 1) {
          const headers = sheetData[0].map((h) => h.trim().toUpperCase());

          for (let i = 1; i < sheetData.length; i++) {
            let row = sheetData[i];
            let rowData = {};

            headers.forEach((header, index) => {
              rowData[header] = row[index] ? row[index].toString().trim() : "";
            });

            if (rowData.DISTRICT && rowData.COMMUNE && rowData.FOKONTANY && rowData.POPULATION && rowData.MENAGES) {
              allData.push({
                region: file.name.split("_")[0].toUpperCase(),
                district: sheetName.toUpperCase(),
                commune: rowData.COMMUNE.toUpperCase(),
                fokontany: rowData.FOKONTANY.toUpperCase(),
                population: isNaN(parseInt(rowData.POPULATION)) ? 0 : parseInt(rowData.POPULATION),
                menages: isNaN(parseInt(rowData.MENAGES)) ? 0 : parseInt(rowData.MENAGES),
              });
            }
          }
        }
      });

      resolve(allData);
    };

    reader.onerror = (error) =>
      reject("❌ Erreur lors de la lecture du fichier :" + error);
  });
};

// 📌 Gère l'importation du fichier
export const handleImport = async (event, setImportedData, setImportDialogOpen, setRegionExistante, setLoading) => {
  const toast = useToast();
  const file = event.target.files[0];

  if (!file) {
    toast({
      title: "❌ Aucun fichier sélectionné",
      status: "warning",
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  setLoading(true);

  try {
    const { regionName, regionExistante } = await verifyFile(file);
    const allData = await extractDataFromXLSX(file);

    toast({
      title: "📩 Données prêtes à être importées",
      status: "info",
      duration: 5000,
      isClosable: true,
    });

    setImportedData(allData);
    setRegionExistante(regionExistante);
    setImportDialogOpen(true);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

// 📌 Envoie les données à la base de données
export const confirmImportToDatabase = async (importedData, setImportDialogOpen, setLoading) => {
  const toast = useToast();

  if (!importedData || importedData.length === 0) {
    toast({
      title: "❌ Aucune donnée à enregistrer !",
      status: "warning",
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://localhost:4000/api/population", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: importedData }),
    });

    const result = await response.json();

    if (response.ok) {
      toast({
        title: "✅ Importation réussie !",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setImportDialogOpen(false);
    } else {
      throw new Error(result.error || "Erreur inconnue");
    }
  } catch (error) {
    toast({
      title: "❌ Erreur d'importation",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setLoading(false);
  }
};

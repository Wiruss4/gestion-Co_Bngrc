import * as XLSX from "xlsx";

// 📌 Vérification du nom du fichier et détection de la région existante
export const verifyFile = async (file) => {
  return new Promise((resolve, reject) => {
    const fileName = file.name;
    const regex = /^(.+?)_CoBngrc\.xlsx$/;
    const match = fileName.match(regex);

    if (!match) {
      return reject("❌ Nom de fichier invalide ! Format attendu : 'NOM_DE_LA_REGION_CoBngrc.xlsx'");
    }

    const regionName = match[1]
      .normalize("NFD") // Supprime les accents éventuels
      .replace(/[\u0300-\u036f]/g, "") // Supprime les diacritiques
      .replace(/_/g, " ") // Remplace les underscores par des espaces
      .replace(/\s+/g, " ") // Remplace plusieurs espaces par un seul
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
        console.error("❌ Erreur lors de la récupération des régions :", error);
        reject("❌ Impossible de récupérer les régions !");
      });
  });
};

// 📌 Fonction d'importation et transformation du fichier Excel en JSON
export const ImportData = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (event) => {
      try {
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
                  population: parseInt(rowData.POPULATION) || 0,
                  menages: parseInt(rowData.MENAGES) || 0,
                });
              }
            }
          }
        });

        if (allData.length === 0) {
          return reject("❌ Aucune donnée valide trouvée dans le fichier !");
        }

        resolve(allData);
      } catch (error) {
        reject("❌ Erreur lors de l'extraction des données :" + error.message);
      }
    };

    reader.onerror = (error) => reject("❌ Erreur lors de la lecture du fichier :" + error);
  });
};

// 📌 Gestion de l'importation et validation des données
export const handleImport = async (event, toast, setImportedData, setImportDialogOpen, setRegionExistante, setLoading) => {
  const file = event.target.files[0];

  if (!file) {
    toast({
      title: "❌ Aucun fichier sélectionné !",
      status: "warning",
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  console.log("📌 Début de l'importation du fichier :", file.name);
  setLoading(true);

  try {
    // Vérification du fichier
    const { regionName, regionExistante } = await verifyFile(file);

    // Extraction des données
    const newData = await ImportData(file);
    console.log("📌 Données importées :", newData);

    if (!Array.isArray(newData) || newData.length === 0) {
      throw new Error("Le fichier ne contient pas de données valides !");
    }

    toast({
      title: "✅ Extraction du Fichier ok ! ",
      description: `Région détectée : ${regionName}`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    setImportedData(newData);
    setRegionExistante(regionExistante);
    setImportDialogOpen(true);
  } catch (error) {
    toast({
      title: "❌ Erreur d'importation",
      description: error,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    console.error("❌ Erreur d'importation :", error);
  } finally {
    setLoading(false);
  }
};

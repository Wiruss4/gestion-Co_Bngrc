import { useState, useEffect } from "react";
import { Input, Select, Button, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { fetchSiteHebergement } from "views/admin/profile/variables/Dataproject"; 

export default function SuiviForm({ onSubmit, initialData }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    date_suivi: new Date().toISOString().split("T")[0],
    heure_suivi: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    id_site: "",
    personnes_sinistrees_presentes: "",
    menages: "",
    hommes: "",
    femmes: "",
    femmes_enceintes: "",
    enfants_moins_5ans: "",
    personnes_agees: "",
    personnes_handicapees: "",
  });

  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadSites() {
      const siteList = await fetchSiteHebergement();
      setSites(siteList);
    }
    loadSites();

    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id_site) {
      toast({ title: "Veuillez sélectionner un site d'hébergement.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    onSubmit(formData);
  };

  const filteredSites = sites.filter(site => site.nom_site.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb="4">
        <FormLabel>Date du suivi</FormLabel>
        <Input type="date" name="date_suivi" value={formData.date_suivi} onChange={handleChange} color="black" borderColor="gray.500" />
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Heure du suivi</FormLabel>
        <Input type="time" name="heure_suivi" value={formData.heure_suivi} onChange={handleChange} color="black" borderColor="gray.500" />
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Nom du Site</FormLabel>
        <Input 
          placeholder="Rechercher un site" 
          onChange={(e) => setSearchTerm(e.target.value)} 
          color="black" 
          borderColor="gray.500"
        />
        <Select name="id_site" value={formData.id_site} onChange={handleChange} color="black" borderColor="gray.500">
          <option value="">Sélectionner un site</option>
          {filteredSites.map(site => (
            <option key={site.id_site} value={site.id_site}>{site.nom_site}</option>
          ))}
        </Select>
      </FormControl>

      {["personnes_sinistrees_presentes", "menages", "hommes", "femmes", "femmes_enceintes", "enfants_moins_5ans", "personnes_agees", "personnes_handicapees"].map((field) => (
        <FormControl key={field} mb="4">
          <FormLabel>{field.replace("_", " ")}</FormLabel>
          <Input 
            type="number" 
            name={field} 
            value={formData[field]} 
            onChange={handleChange} 
            color="black" 
            borderColor="gray.500"
          />
        </FormControl>
      ))}

      <Button type="submit" colorScheme="blue" mt="4">Enregistrer</Button>
    </form>
  );
}

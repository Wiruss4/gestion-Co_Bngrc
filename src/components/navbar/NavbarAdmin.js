// Chakra Imports
import { useLocation } from 'react-router-dom';
import routes from 'routes.js';
import { 
  Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, 
  Flex, Link, Text, useColorModeValue, Button 
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'; // ✅ Ajout des icônes de flèche

export default function AdminNavbar(props) {
  const [scrolled, setScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // ✅ État pour afficher / masquer la navbar

  useEffect(() => {
    window.addEventListener('scroll', changeNavbar);
    return () => {
      window.removeEventListener('scroll', changeNavbar);
    };
  }, []);

  const { secondary, message } = props;
  const location = useLocation();

  // Trouver la route correspondant à l'URL actuelle
  const currentRoute = routes.find(route => location.pathname.includes(route.path));
  const pageTitle = currentRoute ? currentRoute.name : "Dashboard";

  let mainText = useColorModeValue('navy.700', 'white');
  let secondaryText = useColorModeValue('gray.700', 'white');
  let navbarPosition = 'fixed';
  let navbarFilter = 'none';
  let navbarBackdrop = 'blur(20px)';
  let navbarShadow = 'none';
  let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');
  let navbarBorder = 'transparent';
  let secondaryMargin = '0px';
  let paddingX = '15px';
  let gap = '0px';

  const changeNavbar = () => {
    if (window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  // ✅ Fonction pour basculer l'affichage de la navbar
  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderRadius='16px'
      borderWidth='1.5px'
      transition="all 0.3s ease"
      alignItems={{ xl: 'center' }}
      display={secondary ? 'block' : 'flex'}
      minH={isExpanded ? '75px' : '40px'} // ✅ Hauteur dynamique
      justifyContent={{ xl: 'center' }}
      mx='auto'
      mt={secondaryMargin}
      pb='8px'
      right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
      px={{ sm: paddingX, md: '10px' }}
      ps={{ xl: '12px' }}
      pt='8px'
      top={{ base: '12px', md: '16px', lg: '20px', xl: '20px' }}
      w={{
        base: 'calc(100vw - 6%)',
        md: 'calc(100vw - 8%)',
        lg: 'calc(100vw - 6%)',
        xl: 'calc(100vw - 350px)',
        '2xl': 'calc(100vw - 365px)',
      }}>
      
      <Flex w='100%' flexDirection={{ sm: 'column', md: 'row' }} alignItems={{ xl: 'center' }} mb={gap}>
        
        {/* ✅ Bouton flèche pour ouvrir / minimiser la navbar */}
        <Button 
          onClick={toggleNavbar} 
          variant="ghost" 
          size="sm"
          _hover={{ bg: "gray.100" }}
          ml={2}
        >
          {isExpanded ? <ChevronUpIcon boxSize={6} /> : <ChevronDownIcon boxSize={6} />}
        </Button>

        {/* ✅ Affichage conditionnel du contenu */}
        {isExpanded && (
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Box mb={{ sm: '8px', md: '0px' }}>
              <Breadcrumb>
                <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                  <BreadcrumbLink href='#' color={secondaryText}>
                    Pages
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                  <BreadcrumbLink href='#' color={secondaryText}>
                    {pageTitle}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>

              {/* ✅ Titre de la page */}
              <Link
                color={mainText}
                href='#'
                bg='inherit'
                borderRadius='inherit'
                fontWeight='bold'
                fontSize='34px'
                _hover={{ color: { mainText } }}
                _active={{ bg: 'inherit', transform: 'none', borderColor: 'transparent' }}
                _focus={{ boxShadow: 'none' }}>
                {pageTitle}
              </Link>
            </Box>

            {/* ✅ Liens du navbar */}
            <Box ms='auto' w={{ sm: '100%', md: 'unset' }}>
              <AdminNavbarLinks
                onOpen={props.onOpen}
                logoText={props.logoText}
                secondary={props.secondary}
                fixed={props.fixed}
                scrolled={scrolled}
              />
            </Box>
          </Flex>
        )}
      </Flex>

      {secondary ? <Text color='white'>{message}</Text> : null}
    </Box>
  );
}

// ✅ Définition des types de props
AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};

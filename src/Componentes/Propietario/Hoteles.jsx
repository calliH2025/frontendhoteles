import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Container,
  Modal,
  IconButton,
  Alert,
  InputLabel,
  Input,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import VisibilityIcon from '@mui/icons-material/Visibility';
import BedIcon from '@mui/icons-material/Bed';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar el ícono del marcador
const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Lista de servicios disponibles
const serviciosDisponibles = [
  'Pet-friendly',
  'Sustentable',
  'Con asistencia para discapacitados',
  'Cocina',
  'Alberca',
  'Lavanderia',
  'Restaurante',
  'Internet',
  'Agua Caliente',
  'Otros',
];

const API_BASE_URL = 'https://backendreservas-m2zp.onrender.com';

// Configurar interceptor de axios para incluir el token
const setupAxiosInterceptors = (navigate) => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('No se encontró token en localStorage');
        navigate('/');
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error('Error 401:', error.response.data?.error);
        localStorage.removeItem('token');
        localStorage.removeItem('id_usuario');
        navigate('/');
      }
      return Promise.reject(error);
    }
  );
};

// Componente para invalidar el tamaño del mapa
function MapInvalidateSize() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

// Componente para manejar clics en el mapa
function MapClickHandler({ setFormData, setValidationErrors }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setFormData((prev) => ({
        ...prev,
        latitud: lat.toString(),
        longitud: lng.toString(),
      }));
      setValidationErrors((prev) => ({
        ...prev,
        latitud: '',
        longitud: '',
      }));
    },
  });
  return null;
}

// Componente para actualizar el centro y zoom del mapa
function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, 18); // Zoom máximo (18)
    }
  }, [map, center]);
  return null;
}

const Hoteles = () => {
  const navigate = useNavigate();
  const [hoteles, setHoteles] = useState([]);
  const [formData, setFormData] = useState({
    nombrehotel: '',
    direccion: '',
    telefono: '+52 ',
    correo: '',
    numhabitacion: '',
    descripcion: '',
    servicios: [],
    imagen: null,
    removeImage: false,
    latitud: '',
    longitud: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [locationError, setLocationError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [mapCenter, setMapCenter] = useState([21.1399, -98.4194]); // Centro inicial en Huejutla
  const [customServices, setCustomServices] = useState('');
  const [showCustomServicesInput, setShowCustomServicesInput] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    setupAxiosInterceptors(navigate);
    fetchHoteles();
    fetchUserData(); // Obtener datos del usuario para el correo por defecto
  }, [navigate]);

  const fetchHoteles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/hoteles`);
      
      // Manejar la nueva estructura de respuesta
      let hotelesData = [];
      if (response.data.hoteles && Array.isArray(response.data.hoteles)) {
        hotelesData = response.data.hoteles.map((hotel) => ({
          ...hotel,
          id: hotel.id_hotel,
          imagen: hotel.imagen ? JSON.parse(hotel.imagen) : null,
          telefono: hotel.telefono || '',
          servicios: hotel.servicios ? hotel.servicios.split(',') : [], // Convertir string a array
        }));
      } else if (Array.isArray(response.data)) {
        // Fallback para la estructura anterior
        hotelesData = response.data.map((hotel) => ({
          ...hotel,
          id: hotel.id_hotel,
          imagen: hotel.imagen ? JSON.parse(hotel.imagen) : null,
          telefono: hotel.telefono || '',
          servicios: hotel.servicios ? hotel.servicios.split(',') : [], // Convertir string a array
        }));
      } else {
        throw new Error('La respuesta de la API no es válida');
      }
      
      setHoteles(hotelesData);
      setErrorMessage('');
    } catch (error) {
      console.error('Error al obtener hoteles:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || 'Error al cargar los hoteles. Intente de nuevo.');
    }
  };

  // Función para obtener datos del usuario autenticado
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/perfilusuario`);
      setFormData(prev => ({
        ...prev,
        correo: response.data.Correo
      }));
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  const geocodeLocation = async (location) => {
    if (!location.trim()) return;
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: `${location}, Huejutla, Hidalgo, Mexico`,
          format: 'json',
          limit: 1,
        },
      });
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        // Actualizar latitud y longitud automáticamente
        setFormData((prev) => ({
          ...prev,
          latitud: lat.toString(),
          longitud: lon.toString(),
        }));
        setLocationError('');
        // Limpiar errores de validación de lat/lng
        setValidationErrors((prev) => ({
          ...prev,
          latitud: '',
          longitud: '',
        }));
      } else {
        setLocationError('No se encontró la ubicación. Intente con un nombre más específico.');
      }
    } catch (error) {
      console.error('Error al geocodificar:', error);
      setLocationError('Error al buscar la ubicación. Intente de nuevo.');
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'nombrehotel':
        if (!value.trim()) error = 'El nombre del hotel es obligatorio';
        else if (value.trim().length < 3) error = 'El nombre debe tener al menos 3 caracteres';
        else if (value.trim().length > 100) error = 'El nombre no puede exceder 100 caracteres';
        break;
      case 'telefono':
        if (value) {
          // Extraer solo los dígitos del usuario, ignorando el prefijo +52
          const rawDigits = value.replace(/\D/g, '');
          const userDigits = rawDigits.startsWith('52') ? rawDigits.substring(2) : rawDigits;
          if (userDigits.length !== 10) error = 'El teléfono debe contener exactamente 10 dígitos';
        }
        break;
      case 'correo':
        if (!value.trim()) error = 'El correo electrónico es obligatorio';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Ingrese un correo electrónico válido';
        break;
      case 'numhabitacion':
        if (!value) error = 'El número de habitaciones es obligatorio';
        else if (isNaN(value) || parseInt(value) < 1) error = 'Debe tener al menos 1 habitación';
        else if (parseInt(value) > 10000) error = 'El número de habitaciones no puede exceder 10,000';
        break;
      case 'direccion':
        if (value && value.length > 200) error = 'La dirección no puede exceder 200 caracteres';
        break;
      case 'descripcion':
        if (value && value.length > 1000) error = 'La descripción no puede exceder 1000 caracteres';
        break;
      case 'servicios':
        if (value.length === 0) error = 'Debe seleccionar al menos un servicio';
        break;
      case 'latitud':
        if (!value) error = 'La latitud es obligatoria';
        else if (isNaN(value) || value < -90 || value > 90) error = 'La latitud debe estar entre -90 y 90 grados';
        break;
      case 'longitud':
        if (!value) error = 'La longitud es obligatoria';
        else if (isNaN(value) || value < -180 || value > 180) error = 'La longitud debe estar entre -180 y 180 grados';
        break;
      default:
        break;
    }
    return error;
  };

  const validateAllFields = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'imagen' && key !== 'removeImage') {
        const error = validateField(key, formData[key]);
        if (error) errors[key] = error;
      }
    });
    return errors;
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefono') {
      // Extraer solo los dígitos que el usuario está tecleando, ignorando el prefijo +52
      // Primero, obtener todos los dígitos de la cadena actual
      const rawDigits = value.replace(/\D/g, '');
      
      // Si la cadena de dígitos comienza con '52' (del prefijo), removerla para obtener solo los dígitos del usuario
      // De lo contrario, usar todos los dígitos (esto cubre el caso inicial o si el usuario borra el prefijo)
      const userDigits = rawDigits.startsWith('52') ? rawDigits.substring(2) : rawDigits;
      
      // Limitar a un máximo de 10 dígitos para el número de teléfono
      const limitedUserDigits = userDigits.slice(0, 10);
      
      // Construir el valor formateado con el prefijo fijo
      let formattedValue = '+52 ';
      
      if (limitedUserDigits.length >= 1) {
        formattedValue += limitedUserDigits.slice(0, 2);
      }
      if (limitedUserDigits.length >= 3) {
        formattedValue += ` ${limitedUserDigits.slice(2, 4)}`;
      }
      if (limitedUserDigits.length >= 5) {
        formattedValue += ` ${limitedUserDigits.slice(4, 8)}`;
      }
      if (limitedUserDigits.length >= 9) {
        formattedValue += ` ${limitedUserDigits.slice(8)}`;
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else if (name === 'direccion') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Geocodificar automáticamente cuando se escribe la dirección
      if (value.trim()) {
        geocodeLocation(value);
      } else {
        setMapCenter([21.1399, -98.4194]); // Restablecer al centro de Huejutla
        setLocationError('');
      }

    } else if (name === 'servicios') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      
      // Verificar si "Otros" está seleccionado
      const hasOtros = value.includes('Otros');
      setShowCustomServicesInput(hasOtros);
      
      // Si se deselecciona "Otros", limpiar servicios personalizados
      if (!hasOtros) {
        setCustomServices('');
      }
      
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
      const error = validateField(name, value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    const error = validateField(name, name === 'telefono' ? value.replace(/\D/g, '') : value);
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleCustomServicesChange = (e) => {
    setCustomServices(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP)',
          confirmButtonColor: '#0b7583',
          confirmButtonText: 'Aceptar',
        });
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La imagen no puede exceder 5MB',
          confirmButtonColor: '#0b7583',
          confirmButtonText: 'Aceptar',
        });
        return;
      }
      setFormData({
        ...formData,
        imagen: file,
        removeImage: false,
      });
      setImagePreview(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };

  const handleRemoveImageChange = (e) => {
    setFormData({
      ...formData,
      removeImage: e.target.checked,
      imagen: null,
    });
    if (e.target.checked) {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateAllFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setErrorMessage('Por favor corrija los errores en el formulario.');
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append('nombrehotel', formData.nombrehotel);
    formDataToSend.append('direccion', formData.direccion);
    formDataToSend.append('telefono', formData.telefono);
    formDataToSend.append('correo', formData.correo);
    formDataToSend.append('numhabitacion', formData.numhabitacion);
    formDataToSend.append('descripcion', formData.descripcion);
    // Procesar servicios incluyendo los personalizados
    let serviciosFinales = [...formData.servicios];
    if (showCustomServicesInput && customServices.trim()) {
      // Remover "Otros" de la lista y agregar los servicios personalizados
      serviciosFinales = serviciosFinales.filter(servicio => servicio !== 'Otros');
      const serviciosPersonalizados = customServices.split(',').map(s => s.trim()).filter(s => s);
      serviciosFinales.push(...serviciosPersonalizados);
    }
    formDataToSend.append('servicios', serviciosFinales.join(',')); // Convertir array a string
    formDataToSend.append('removeImage', formData.removeImage);
    if (formData.imagen instanceof File) {
      formDataToSend.append('imagen', formData.imagen);
    }
    if (formData.latitud) formDataToSend.append('latitud', formData.latitud);
    if (formData.longitud) formDataToSend.append('longitud', formData.longitud);
    if (!editingId) {
      formDataToSend.append('visible', '1'); // Set visible to 1 for new hotels
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/hoteles/${editingId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/hoteles`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchHoteles();
      resetForm();
      setOpenModal(false);
    } catch (error) {
      console.error('Error al guardar hotel:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || 'Error al guardar el hotel. Intente de nuevo.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este hotel?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/hoteles/${id}`);
        fetchHoteles();
        setErrorMessage('');
      } catch (error) {
        console.error('Error al eliminar hotel:', error.response?.data || error.message);
        setErrorMessage(error.response?.data?.error || 'Error al eliminar el hotel. Verifique las dependencias o intente de nuevo.');
      }
    }
  };

  const handleEdit = (hotel) => {
    // Separar servicios predefinidos de servicios personalizados
    const serviciosPredefinidos = serviciosDisponibles.filter(servicio => 
      hotel.servicios && hotel.servicios.includes(servicio)
    );
    
    // Si hay servicios que no están en la lista predefinida, agregar "Otros" y ponerlos en customServices
    const serviciosPersonalizados = hotel.servicios ? 
      hotel.servicios.filter(servicio => !serviciosDisponibles.includes(servicio)) : [];
    
    const serviciosFinales = serviciosPersonalizados.length > 0 ? 
      [...serviciosPredefinidos, 'Otros'] : serviciosPredefinidos;
    
    setFormData({
      nombrehotel: hotel.nombrehotel || '',
      direccion: hotel.direccion || '',
      telefono: hotel.telefono ? (hotel.telefono.startsWith('+52') ? hotel.telefono : `+52 ${hotel.telefono.replace(/\D/g, '')}`) : '+52 ',
      correo: hotel.correo || '',
      numhabitacion: hotel.numhabitacion || '',
      descripcion: hotel.descripcion || '',
      servicios: serviciosFinales,
      imagen: null,
      removeImage: false,
      latitud: hotel.latitud?.toString() || '',
      longitud: hotel.longitud?.toString() || '',
    });
    
    setCustomServices(serviciosPersonalizados.join(', '));
    setShowCustomServicesInput(serviciosPersonalizados.length > 0);
    
    setImagePreview(hotel.imagen && hotel.imagen?.data ? `data:${hotel.imagen.mimeType};base64,${hotel.imagen.data}` : null);
    setMapCenter([parseFloat(hotel.latitud) || 21.1399, parseFloat(hotel.longitud) || -98.4194]);
    setEditingId(hotel.id_hotel);
    setOpenModal(true);
    setValidationErrors({});
    setTouched({});
  };

  const resetForm = () => {
    setFormData({
      nombrehotel: '',
      direccion: '',
      telefono: '+52 ',
      correo: '',
      numhabitacion: '',
      descripcion: '',
      servicios: [],
      imagen: null,
      removeImage: false,
      latitud: '',
      longitud: '',
    });
    setImagePreview(null);
    setEditingId(null);
    setOpenModal(false);
    setLocationError('');
    setValidationErrors({});
    setTouched({});
    setErrorMessage('');
    setMapCenter([21.1399, -98.4194]);
    setCustomServices('');
    setShowCustomServicesInput(false);
  };

  // Configuración del mapa centrado en Huejutla
  const huejutlaCenter = [21.1399, -98.4194];
  const maxBounds = [
    [21.05, -98.55], // Suroeste
    [21.25, -98.30], // Noreste
  ];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitud: latitude.toString(),
            longitud: longitude.toString(),
          }));
          setMapCenter([latitude, longitude]);
          setLocationError('');
          setValidationErrors((prev) => ({
            ...prev,
            latitud: '',
            longitud: '',
          }));
        },
        (error) => {
          console.error('Error al obtener la ubicación actual:', error.message);
          setLocationError('No se pudo obtener la ubicación actual. Por favor, verifique la configuración de geolocalización.');
          setMapCenter([21.1399, -98.4194]); // Restablecer al centro de Huejutla en caso de error
        }
      );
    } else {
      setLocationError('La geolocalización no es soportada por su navegador.');
    }
  };

  const clearCoordinates = () => {
    setFormData((prev) => ({
      ...prev,
      latitud: '',
      longitud: '',
    }));
    setMapCenter([21.1399, -98.4194]); // Restablecer al centro de Huejutla
    setLocationError('');
    setValidationErrors((prev) => ({
      ...prev,
      latitud: '',
      longitud: '',
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, background: '#ffffff', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#0b7583', fontWeight: 'bold', mb: 4 }}>
        Gestión de Hoteles
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{
            background: 'linear-gradient(135deg, #4c94bc, #549c94)',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '0.95rem',
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(76, 148, 188, 0.3)',
            border: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #0b7583, #4c94bc)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(11, 117, 131, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Agregar Hotel
        </Button>
      </Box>

      {errorMessage && (
        <Box sx={{ mb: 3 }}>
          <Alert
            severity="error"
            onClose={() => setErrorMessage('')}
            sx={{
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            {errorMessage}
          </Alert>
        </Box>
      )}

      <Modal open={openModal} onClose={resetForm}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', md: 800 },
            height: { xs: 'auto', md: 650 },
            bgcolor: 'background.paper',
            boxShadow: '0 20px 40px rgba(11, 117, 131, 0.15)',
            p: 4,
            borderRadius: '8px',
            maxHeight: '85vh',
            overflowY: 'auto',
            border: `2px solid #b3c9ca`,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%)',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: '#0b7583',
              fontWeight: '700',
              textAlign: 'center',
              mb: 4,
              fontSize: '1.5rem',
            }}
          >
            {editingId ? 'Editar Hotel' : 'Agregar Nuevo Hotel'}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {[
              { label: 'Nombre del Hotel', name: 'nombrehotel', type: 'text', required: true },
              { label: 'Dirección', name: 'direccion', type: 'text', required: false, helperText: 'Al escribir la dirección se obtienen automáticamente las coordenadas' },
              {
                label: 'Teléfono',
                name: 'telefono',
                type: 'text',
                required: false,
                placeholder: '+52 55 1234 5678',
                helperText: 'El prefijo +52 es fijo. Ingresa solo los 10 dígitos del número',
              },
              { label: 'Correo Electrónico', name: 'correo', type: 'email', required: true, disabled: true, helperText: 'Se carga automáticamente con tu correo registrado' },
              { label: 'Número de Habitaciones', name: 'numhabitacion', type: 'number', required: true, inputProps: { min: 1, max: 10000 } },
                          ].map(({ label, name, type, required, inputProps, placeholder, disabled, helperText }) => (
                              <TextField
                  key={name}
                  label={label}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  variant="outlined"
                  fullWidth
                  required={required}
                  disabled={disabled}
                  inputProps={inputProps}
                  placeholder={placeholder}
                  error={touched[name] && !!validationErrors[name]}
                  helperText={helperText || (touched[name] && validationErrors[name])}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f8fbfc',
                    transition: 'all 0.3s ease',
                    '& fieldset': {
                      borderColor: '#b3c9ca',
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4c94bc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0b7583',
                      boxShadow: '0 0 12px rgba(76, 148, 188, 0.2)',
                    },
                    '&.Mui-error fieldset': {
                      borderColor: '#d32f2f',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#f5f5f5',
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#549c94',
                    fontWeight: '600',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0b7583',
                  },
                  '& .MuiInputLabel-root.Mui-error': {
                    color: '#d32f2f',
                  },
                  '& .MuiFormHelperText-root.Mui-error': {
                    color: '#d32f2f',
                    fontWeight: '500',
                  },
                }}
              />
            ))}

            <FormControl
              fullWidth
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f8fbfc',
                  '& fieldset': {
                    borderColor: '#b3c9ca',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4c94bc',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0b7583',
                    boxShadow: '0 0 12px rgba(76, 148, 188, 0.2)',
                  },
                  '&.Mui-error fieldset': {
                    borderColor: '#d32f2f',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#549c94',
                  fontWeight: '600',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#0b7583',
                },
                '& .MuiInputLabel-root.Mui-error': {
                  color: '#d32f2f',
                },
                '& .MuiFormHelperText-root.Mui-error': {
                  color: '#d32f2f',
                  fontWeight: '500',
                },
              }}
              error={touched.servicios && !!validationErrors.servicios}
            >
              <InputLabel id="servicios-label">Servicios</InputLabel>
              <Select
                labelId="servicios-label"
                name="servicios"
                multiple
                value={formData.servicios}
                onChange={handleInputChange}
                onBlur={handleBlur}
                renderValue={(selected) => selected.join(', ')}
                variant="outlined"
              >
                {serviciosDisponibles.map((servicio) => (
                  <MenuItem key={servicio} value={servicio}>
                    <Checkbox checked={formData.servicios.includes(servicio)} />
                    {servicio}
                  </MenuItem>
                ))}
              </Select>
              {touched.servicios && validationErrors.servicios && (
                <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.5, fontWeight: '500' }}>
                  {validationErrors.servicios}
                </Typography>
              )}
            </FormControl>

            {/* Campo para servicios personalizados */}
            {showCustomServicesInput && (
              <TextField
                label="Servicios Personalizados"
                name="customServices"
                type="text"
                value={customServices}
                onChange={handleCustomServicesChange}
                variant="outlined"
                fullWidth
                placeholder="Escribe los servicios separados por comas (ej: WiFi, Estacionamiento, Spa)"
                helperText="Escribe los servicios adicionales que no están en la lista anterior"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f8fbfc',
                    '& fieldset': {
                      borderColor: '#b3c9ca',
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4c94bc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0b7583',
                      boxShadow: '0 0 12px rgba(76, 148, 188, 0.2)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#549c94',
                    fontWeight: '600',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0b7583',
                  },
                }}
              />
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <TextField
                label="Latitud"
                name="latitud"
                type="text"
                value={formData.latitud}
                onChange={handleInputChange}
                onBlur={handleBlur}
                variant="outlined"
                fullWidth
                placeholder="-90.0 a 90.0"
                error={touched.latitud && !!validationErrors.latitud}
                helperText={touched.latitud && validationErrors.latitud}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f8fbfc',
                    '& fieldset': {
                      borderColor: '#b3c9ca',
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4c94bc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0b7583',
                      boxShadow: '0 0 12px rgba(76, 148, 188, 0.2)',
                    },
                    '&.Mui-error fieldset': {
                      borderColor: '#d32f2f',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#549c94',
                    fontWeight: '600',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0b7583',
                  },
                }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => getCurrentLocation()}
                sx={{
                  borderColor: '#4c94bc',
                  color: '#4c94bc',
                  borderRadius: '8px',
                  minWidth: 'auto',
                  px: 2,
                  py: 1.5,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#0b7583',
                    backgroundColor: '#4c94bc10',
                  },
                }}
                title="Obtener ubicación actual"
              >
                📍
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={clearCoordinates}
                sx={{
                  borderColor: '#f3a384',
                  color: '#f3a384',
                  borderRadius: '8px',
                  minWidth: 'auto',
                  px: 2,
                  py: 1.5,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#0b7583',
                    backgroundColor: '#f3a38410',
                  },
                }}
                title="Limpiar coordenadas"
              >
                🗙
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <TextField
                label="Longitud"
                name="longitud"
                type="text"
                value={formData.longitud}
                onChange={handleInputChange}
                onBlur={handleBlur}
                variant="outlined"
                fullWidth
                placeholder="-180.0 a 180.0"
                error={touched.longitud && !!validationErrors.longitud}
                helperText={touched.longitud && validationErrors.longitud}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f8fbfc',
                    '& fieldset': {
                      borderColor: '#b3c9ca',
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4c94bc',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0b7583',
                      boxShadow: '0 0 12px rgba(76, 148, 188, 0.2)',
                    },
                    '&.Mui-error fieldset': {
                      borderColor: '#d32f2f',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#549c94',
                    fontWeight: '600',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0b7583',
                  },
                }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => getCurrentLocation()}
                sx={{
                  borderColor: '#4c94bc',
                  color: '#4c94bc',
                  borderRadius: '8px',
                  minWidth: 'auto',
                  px: 2,
                  py: 1.5,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#0b7583',
                    backgroundColor: '#4c94bc10',
                  },
                }}
                title="Obtener ubicación actual"
              >
                📍
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={clearCoordinates}
                sx={{
                  borderColor: '#f3a384',
                  color: '#f3a384',
                  borderRadius: '8px',
                  minWidth: 'auto',
                  px: 2,
                  py: 1.5,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#0b7583',
                    backgroundColor: '#f3a38410',
                  },
                }}
                title="Limpiar coordenadas"
              >
                🗙
              </Button>
            </Box>


            <Box sx={{ gridColumn: '1 / -1', mb: 3 }}>
              <InputLabel sx={{ color: '#0b7583', fontWeight: '600', mb: 2, fontSize: '1rem' }}>
                Seleccionar ubicación en Huejutla
              </InputLabel>
              <Box
                sx={{
                  height: '300px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: `2px solid #b3c9ca`,
                  '& .leaflet-container': {
                    height: '100%',
                    width: '100%',
                  },
                }}
              >
                <MapContainer
                  center={mapCenter}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                  maxBounds={maxBounds}
                  maxBoundsViscosity={1.0}
                  minZoom={12}
                  maxZoom={18}
                >
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='© <a href="https://www.esri.com/">Esri</a>, USGS, NOAA'
                  />
                  <MapInvalidateSize />
                  {formData.latitud && formData.longitud && !isNaN(parseFloat(formData.latitud)) && !isNaN(parseFloat(formData.longitud)) && (
                    <Marker position={[parseFloat(formData.latitud), parseFloat(formData.longitud)]} icon={markerIcon}>
                      <Popup>Ubicación seleccionada</Popup>
                    </Marker>
                  )}
                  <MapClickHandler setFormData={setFormData} setValidationErrors={setValidationErrors} />
                  <MapCenterUpdater center={mapCenter} />
                </MapContainer>
              </Box>
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#549c94', fontWeight: '500' }}>
                Busca una ubicación o haz clic en el mapa para seleccionar la ubicación del hotel.
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#4c94bc', fontWeight: '500' }}>
                💡 Usa el botón 📍 para obtener tu ubicación actual o 🗙 para limpiar las coordenadas.
              </Typography>
            </Box>

            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              onBlur={handleBlur}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              error={touched.descripcion && !!validationErrors.descripcion}
              helperText={touched.descripcion && validationErrors.descripcion}
              sx={{
                mb: 3,
                gridColumn: '1 / -1',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f8fbfc',
                  '& fieldset': {
                    borderColor: '#b3c9ca',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4c94bc',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0b7583',
                    boxShadow: '0 0 12px rgba(76, 148, 188, 0.2)',
                  },
                  '&.Mui-error fieldset': {
                    borderColor: '#d32f2f',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#549c94',
                  fontWeight: '600',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#0b7583',
                },
                '& .MuiInputLabel-root.Mui-error': {
                  color: '#d32f2f',
                },
                '& .MuiFormHelperText-root.Mui-error': {
                  color: '#d32f2f',
                  fontWeight: '500',
                },
              }}
            />

            <Box sx={{ mb: 3, gridColumn: '1 / -1' }}>
              <InputLabel sx={{ color: '#0b7583', fontWeight: '600', mb: 2, fontSize: '1rem' }}>
                Imagen del Hotel
              </InputLabel>
              <Input
                type="file"
                name="imagen"
                onChange={handleImageChange}
                inputProps={{ accept: 'image/*' }}
                fullWidth
                sx={{
                  backgroundColor: '#f8fbfc',
                  borderRadius: '8px',
                  padding: '12px',
                  border: `2px solid #b3c9ca`,
                  '&:hover': {
                    borderColor: '#4c94bc',
                  },
                  transition: 'all 0.3s ease',
                }}
              />
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#549c94', fontWeight: '500' }}>
                Formatos permitidos: JPG, PNG, GIF, WebP. Tamaño máximo: 5MB
              </Typography>
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    style={{
                      height: '120px',
                      width: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(11, 117, 131, 0.2)',
                      border: `2px solid #b3c9ca`,
                    }}
                  />
                </Box>
              )}
              {editingId && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.removeImage}
                      onChange={handleRemoveImageChange}
                      name="removeImage"
                      sx={{
                        color: '#4c94bc',
                        '&.Mui-checked': {
                          color: '#0b7583',
                        },
                      }}
                    />
                  }
                  label="Eliminar imagen actual"
                  sx={{ mt: 2, color: '#549c94', fontWeight: '500' }}
                />
              )}
            </Box>

            {locationError && (
              <Box sx={{ gridColumn: '1 / -1', mb: 3 }}>
                <Alert severity="warning" onClose={() => setLocationError('')} sx={{ borderRadius: '8px' }}>
                  {locationError}
                </Alert>
              </Box>
            )}

            <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #4c94bc, #549c94)',
                  borderRadius: '8px',
                  padding: '12px 32px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  textTransform: 'none',
                  minWidth: '140px',
                  boxShadow: '0 4px 12px rgba(76, 148, 188, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0b7583, #4c94bc)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(11, 117, 131, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {editingId ? 'Actualizar' : 'Agregar'}
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#f3a384',
                  color: '#f3a384',
                  borderRadius: '8px',
                  padding: '12px 32px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  textTransform: 'none',
                  minWidth: '140px',
                  borderWidth: '2px',
                  '&:hover': {
                    backgroundColor: '#f3a384',
                    color: 'white',
                    borderColor: '#f3a384',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(243, 163, 132, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={resetForm}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 12px 24px rgba(11, 117, 131, 0.15)',
          border: `2px solid #b3c9ca`,
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="tabla de hoteles">
          <TableHead sx={{ background: 'linear-gradient(135deg, #4c94bc, #549c94)' }}>
            <TableRow>
              {['Nombre', 'Dirección', 'Habitaciones', 'Servicios', 'Imagen', 'Teléfono', 'Acciones'].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    fontWeight: '700',
                    color: 'white',
                    fontSize: '1rem',
                    padding: '20px 16px',
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {hoteles.map((hotel, index) => (
              <TableRow
                key={hotel.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#f8fbfc' : 'white',
                  '&:hover': {
                    backgroundColor: '#b3c9ca20',
                    transform: 'scale(1.001)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <TableCell sx={{ color: '#0b7583', fontWeight: '600', fontSize: '0.95rem' }}>{hotel.nombrehotel}</TableCell>
                <TableCell sx={{ color: '#549c94', fontWeight: '500' }}>{hotel.direccion || 'Sin dirección'}</TableCell>
                <TableCell sx={{ color: '#4c94bc', fontWeight: '600', textAlign: 'center' }}>{hotel.numhabitacion}</TableCell>
                <TableCell sx={{ color: '#549c94', fontWeight: '500' }}>{hotel.servicios.join(', ') || 'Sin servicios'}</TableCell>
                <TableCell>
                  {hotel.imagen && hotel.imagen.data ? (
                    <img
                      src={`data:${hotel.imagen.mimeType};base64,${hotel.imagen.data}`}
                      alt={hotel.nombrehotel}
                      style={{
                        height: '60px',
                        width: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(76, 148, 188, 0.2)',
                        border: `2px solid #b3c9ca`,
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontStyle: 'italic', color: '#549c94' }}>Sin imagen</Typography>
                  )}
                </TableCell>
                <TableCell sx={{ color: '#4c94bc', fontWeight: '500' }}>{hotel.telefono || 'N/A'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => handleEdit(hotel)}
                      sx={{
                        backgroundColor: '#4c94bc',
                        color: 'white',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: '#0b7583',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <EditIcon sx={{ fontSize: '18px' }} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(hotel.id)}
                      sx={{
                        backgroundColor: '#f3a384',
                        color: 'white',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: '#e8956f',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: '18px' }} />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/propietario/cuartos/${hotel.id}`)}
                      sx={{
                        backgroundColor: '#549c94',
                        color: 'white',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: '#0b7583',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Tooltip title="Habitaciones del Hotel" arrow>
                        <span><BedIcon sx={{ fontSize: '18px' }} /></span>
                      </Tooltip>
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Hoteles;
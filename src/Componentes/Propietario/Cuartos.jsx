import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Select,
  MenuItem,
  InputLabel,
  Input,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../Autenticacion/AuthContext';
import Swal from 'sweetalert2';

const API_BASE_URL = 'https://backendreservas-m2zp.onrender.com'; 

const Cuartos = () => {
  const navigate = useNavigate();
  const { id: idHotelParam } = useParams(); // Nuevo: obtener id del hotel de la URL
  const { user, logout } = useAuth();
  const [cuartos, setCuartos] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [tiposHabitacion, setTiposHabitacion] = useState([]);
  const [formData, setFormData] = useState({
    cuarto: '',
    estado: 'Disponible',
    id_hoteles: '',
    idtipohabitacion: '',
    imagenes: [],
    imagenhabitacion: null,
    existingImages: [],
    existingImagenhabitacion: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!user || user.tipo !== 'Propietario') {
      navigate('/login');
      return;
    }

    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    const loadData = async () => {
      await fetchHoteles();
      await fetchTiposHabitacion();
      await fetchCuartos();
    };

    loadData();
  }, [navigate, user, logout, idHotelParam]); // Agregar idHotelParam como dependencia

  // Modificado: Si hay idHotelParam, filtrar por hotel, si no, traer todos
  const fetchCuartos = async () => {
    try {
      let response;
      if (idHotelParam) {
        response = await axios.get(`${API_BASE_URL}/api/cuartos/hotel/${idHotelParam}`);
      } else {
        response = await axios.get(`${API_BASE_URL}/api/cuartos`);
      }
      const cuartosWithImages = response.data.map(cuarto => ({
        ...cuarto,
        imagenPreview: cuarto.imagenhabitacion ? `data:image/jpeg;base64,${cuarto.imagenhabitacion}` : null,
      }));
      setCuartos(cuartosWithImages);
      setErrorMessage('');
    } catch (error) {
      console.error('Error al obtener cuartos:', error);
      setErrorMessage(error.response?.data?.error || 'Error al cargar los cuartos. Intente de nuevo.');
    }
  };

  const fetchHoteles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/hoteles`);
      const userHoteles = response.data.filter(hotel => hotel.id_usuario === user.id);
      setHoteles(userHoteles || []);
    } catch (error) {
      console.error('Error al obtener hoteles:', error);
      setErrorMessage('Error al cargar los hoteles. Intente de nuevo.');
    }
  };

  const fetchTiposHabitacion = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tipohabitacion`);
      setTiposHabitacion(response.data || []);
    } catch (error) {
      console.error('Error al obtener tipos de habitación:', error);
      setErrorMessage('Error al cargar los tipos de habitación. Intente de nuevo.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cuarto') {
      // Validar que solo sean números positivos
      if (/^\d*$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e, field) => {
    const files = Array.from(e.target.files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    // Validar que todos los archivos sean imágenes
    const invalidFiles = files.filter(file => !validImageTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Solo se pueden subir imágenes en formatos JPG, PNG, GIF o WEBP.',
        confirmButtonColor: '#0b7583',
      });
      return;
    }

    if (field === 'imagenes') {
      setFormData({
        ...formData,
        imagenes: [...formData.imagenes, ...files],
      });
    } else if (field === 'imagenhabitacion') {
      setFormData({
        ...formData,
        imagenhabitacion: files[0],
      });
    }
  };

  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      setFormData({
        ...formData,
        existingImages: formData.existingImages.filter((_, i) => i !== index),
        imagesToRemove: [...(formData.imagesToRemove || []), index],
      });
    } else if (index === 'imagenhabitacion') {
      setFormData({
        ...formData,
        imagenhabitacion: null,
      });
    } else {
      setFormData({
        ...formData,
        imagenes: formData.imagenes.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar que el campo cuarto no esté vacío y sea un número positivo
    if (!formData.cuarto || isNaN(formData.cuarto) || formData.cuarto <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre de la habitación debe ser un número positivo.',
        confirmButtonColor: '#0b7583',
        customClass: {
          container: 'swal2-container-custom',
          popup: 'swal2-popup-custom'
        },
        backdrop: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true,
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Validar que el número de habitación no se repita en el mismo hotel
    const numeroHabitacion = parseInt(formData.cuarto);
    const hotelSeleccionado = formData.id_hoteles;
    
    // Filtrar cuartos del mismo hotel (excluyendo el que se está editando)
    const cuartosDelMismoHotel = cuartos.filter(cuarto => 
      cuarto.id_hoteles === hotelSeleccionado && 
      cuarto.id !== editingId
    );
    
    const numeroExiste = cuartosDelMismoHotel.some(cuarto => 
      parseInt(cuarto.cuarto) === numeroHabitacion
    );
    
    if (numeroExiste) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `El número de habitación ${numeroHabitacion} ya existe en este hotel.`,
        confirmButtonColor: '#0b7583',
        customClass: {
          container: 'swal2-container-custom',
          popup: 'swal2-popup-custom'
        },
        backdrop: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true,
        confirmButtonText: 'Entendido'
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('cuarto', formData.cuarto);
    formDataToSend.append('estado', formData.estado);
    formDataToSend.append('id_hoteles', formData.id_hoteles);
    formDataToSend.append('idtipohabitacion', formData.idtipohabitacion);

    formData.imagenes.forEach((image) => {
      formDataToSend.append('imagenes', image);
    });
    if (formData.imagenhabitacion) {
      formDataToSend.append('imagenhabitacion', formData.imagenhabitacion);
    }
    if (formData.imagesToRemove) {
      formDataToSend.append('imagesToRemove', JSON.stringify(formData.imagesToRemove));
    }

    try {
      const url = editingId ? `${API_BASE_URL}/api/cuartos/${editingId}` : `${API_BASE_URL}/api/cuartos`;
      const method = editingId ? 'put' : 'post';
      await axios[method](url, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchCuartos();
      await fetchHoteles(); // Recargar hoteles para actualizar numhabitacion
      resetForm();
    } catch (error) {
      console.error('Error al guardar cuarto:', error);
      setErrorMessage(error.response?.data?.error || 'Error al guardar el cuarto. Intente de nuevo.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este cuarto?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/cuartos/${id}`);
        await fetchCuartos();
        await fetchHoteles(); // Recargar hoteles para actualizar numhabitacion
        setErrorMessage('');
      } catch (error) {
        console.error('Error al eliminar cuarto:', error);
        setErrorMessage(error.response?.data?.error || 'Error al eliminar el cuarto. Intente de nuevo.');
      }
    }
  };

  const handleEdit = async (cuarto) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cuartos/${cuarto.id}`);
      const data = response.data;
      setFormData({
        cuarto: data.cuarto,
        estado: data.estado,
        id_hoteles: data.id_hoteles,
        idtipohabitacion: data.idtipohabitacion,
        imagenes: [],
        imagenhabitacion: null,
        existingImages: data.imagenes.map(img => `data:image/jpeg;base64,${img}`),
        existingImagenhabitacion: data.imagenhabitacion ? `data:image/jpeg;base64,${data.imagenhabitacion}` : null,
        imagesToRemove: [],
      });
      setEditingId(cuarto.id);
      setOpenModal(true);
    } catch (error) {
      console.error('Error al obtener datos para edición:', error);
      setErrorMessage('Error al cargar los datos para edición.');
    }
  };

  const resetForm = () => {
    setFormData({
      cuarto: '',
      estado: 'Disponible',
      id_hoteles: '',
      idtipohabitacion: '',
      imagenes: [],
      imagenhabitacion: null,
      existingImages: [],
      existingImagenhabitacion: null,
      imagesToRemove: [],
    });
    setEditingId(null);
    setOpenModal(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, background: '#ffffff', minHeight: '100vh' }}>
      <style>
        {`
          .swal2-container-custom {
            z-index: 9999 !important;
          }
          .swal2-popup-custom {
            z-index: 10000 !important;
          }
          .swal2-backdrop-show {
            z-index: 9998 !important;
          }
        `}
      </style>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#0b7583', fontWeight: 'bold', mb: 4 }}>
        Gestión de Habitaciones
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
            '&:hover': {
              background: 'linear-gradient(135deg, #0b7583, #4c94bc)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(11, 117, 131, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Agregar Habitación
        </Button>
      </Box>

      {errorMessage && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ borderRadius: '10px' }}>
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
            width: { xs: '95%', md: 600 },
            bgcolor: 'background.paper',
            boxShadow: '0 20px 40px rgba(11, 117, 131, 0.15)',
            p: 4,
            borderRadius: '8px',
            maxHeight: '85vh',
            overflowY: 'auto',
            border: '2px solid #b3c9ca',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: '#0b7583', fontWeight: '700', textAlign: 'center', mb: 4 }}>
            {editingId ? 'Editar Habitación' : 'Agregar Nueva Habitación'}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <TextField
              label="Número de la Habitación"
              name="cuarto"
              type="text"
              value={formData.cuarto}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
              inputProps={{ pattern: "\\d*", title: "Solo se permiten números positivos" }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiInputLabel-root': { color: '#549c94' } }}
            />
            <TextField
              label="Estado"
              name="estado"
              select
              value={formData.estado}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiInputLabel-root': { color: '#549c94' } }}
            >
              <MenuItem value="Disponible">Disponible</MenuItem>
              <MenuItem value="NoDisponible">No Disponible</MenuItem>
              <MenuItem value="Ocupado">Ocupado</MenuItem>
            </TextField>
            <TextField
              label="Hotel"
              name="id_hoteles"
              select
              value={formData.id_hoteles}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
              disabled={editingId !== null}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiInputLabel-root': { color: '#549c94' } }}
            >
              {hoteles.map((hotel) => (
                <MenuItem key={hotel.id_hotel} value={hotel.id_hotel}>
                  {hotel.nombrehotel}
                </MenuItem>
              ))}
            </TextField>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                label="Tipo de Habitación"
                name="idtipohabitacion"
                select
                value={formData.idtipohabitacion}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiInputLabel-root': { color: '#549c94' } }}
              >
                {tiposHabitacion.map((tipo) => (
                  <MenuItem key={tipo.id_tipohabitacion} value={tipo.id_tipohabitacion}>
                    {tipo.tipohabitacion}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="outlined"
                onClick={() => navigate('/propietario/tiposhabitaciones')}
                startIcon={<SettingsIcon />}
                sx={{
                  borderColor: '#4c94bc',
                  color: '#4c94bc',
                  borderRadius: '8px',
                  minWidth: 'auto',
                  px: 2,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#0b7583',
                    backgroundColor: '#4c94bc10',
                  },
                }}
                title="Gestionar tipos de habitación"
              >
                Registrar
              </Button>
            </Box>

            <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
              <InputLabel sx={{ color: '#0b7583', fontWeight: '600', mb: 1 }}>Imágenes de la habitación (Galería)</InputLabel>
              <Input
                type="file"
                name="imagenes"
                onChange={(e) => handleImageChange(e, 'imagenes')}
                inputProps={{ multiple: true, accept: 'image/*' }}
                fullWidth
              />
              {(formData.existingImages.length > 0 || formData.imagenes.length > 0) && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.existingImages.map((image, index) => (
                    <Box key={`existing-${index}`} sx={{ position: 'relative' }}>
                      <img
                        src={image}
                        alt={`Vista previa galería ${index + 1}`}
                        style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <IconButton
                        onClick={() => handleRemoveImage(index, true)}
                        sx={{ position: 'absolute', top: 0, right: 0, color: 'white', backgroundColor: '#f3a384' }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))}
                  {formData.imagenes.map((image, index) => (
                    <Box key={`new-${index}`} sx={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Vista previa galería ${index + 1}`}
                        style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <IconButton
                        onClick={() => handleRemoveImage(index, false)}
                        sx={{ position: 'absolute', top: 0, right: 0, color: 'white', backgroundColor: '#f3a384' }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
              <InputLabel sx={{ color: '#0b7583', fontWeight: '600', mb: 1 }}>Imagen Principal</InputLabel>
              <Input
                type="file"
                name="imagenhabitacion"
                onChange={(e) => handleImageChange(e, 'imagenhabitacion')}
                inputProps={{ accept: 'image/*' }}
                fullWidth
              />
              {(formData.existingImagenhabitacion || formData.imagenhabitacion) && (
                <Box sx={{ mt: 2, position: 'relative' }}>
                  <img
                    src={formData.existingImagenhabitacion || URL.createObjectURL(formData.imagenhabitacion)}
                    alt="Vista previa imagen principal"
                    style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage('imagenhabitacion', !!formData.existingImagenhabitacion)}
                    sx={{ position: 'absolute', top: 0, right: 0, color: 'white', backgroundColor: '#f3a384' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 3, justifyContent: 'center', mt: 4 }}>
              <Button type="submit" variant="contained" sx={{ background: '#4c94bc', borderRadius: '8px', padding: '12px 32px' }}>
                {editingId ? 'Actualizar' : 'Agregar'}
              </Button>
              <Button variant="outlined" sx={{ borderColor: '#f3a384', color: '#f3a384', borderRadius: '8px', padding: '12px 32px' }} onClick={resetForm}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Paper sx={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 12px 24px rgba(11, 117, 131, 0.15)' }}>
        <Table sx={{ minWidth: 650 }} aria-label="cuartos table">
          <TableHead sx={{ background: 'linear-gradient(135deg, #4c94bc, #549c94)' }}>
            <TableRow>
              {['Nombre', 'Estado', 'Hotel', 'Tipo de Habitación', 'Imagen Principal', 'Galería', 'Acciones'].map((head) => (
                <TableCell key={head} sx={{ fontWeight: '700', color: 'white', fontSize: '1rem' }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {cuartos.length > 0 ? (
              cuartos.map((cuarto) => (
                <TableRow key={cuarto.id} sx={{ '&:hover': { backgroundColor: '#b3c9ca20' } }}>
                  <TableCell sx={{ color: '#0b7583', fontWeight: '600' }}>{cuarto.cuarto}</TableCell>
                  <TableCell sx={{ color: '#549c94', fontWeight: '500' }}>{cuarto.estado}</TableCell>
                  <TableCell sx={{ color: '#549c94', fontWeight: '500' }}>{cuarto.nombrehotel || 'Sin hotel'}</TableCell>
                  <TableCell sx={{ color: '#4c94bc', fontWeight: '500' }}>{cuarto.tipohabitacion || 'Sin tipo'}</TableCell>
                  <TableCell>
                    {cuarto.imagenPreview ? (
                      <img src={cuarto.imagenPreview} alt="Imagen principal" style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      'Sin imagen'
                    )}
                  </TableCell>
                  <TableCell>
                    {cuarto.imagenes && cuarto.imagenes.length > 0 ? <ImageIcon sx={{ color: '#4c94bc' }} /> : 'Sin galería'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleEdit(cuarto)} sx={{ backgroundColor: '#4c94bc', color: 'white' }}>
                        <EditIcon />                                                        
                      </IconButton>
                      <IconButton onClick={() => handleDelete(cuarto.id)} sx={{ backgroundColor: '#f3a384', color: 'white' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#b3c9ca' }}>
                  No hay habitaciones disponibles para este usuario.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Cuartos;
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Autenticacion/AuthContext';
import Swal from 'sweetalert2';

const API_BASE_URL = 'https://backendreservas-m2zp.onrender.com'; // Cambia esto según tu configuración

const Promociones = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [promociones, setPromociones] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [formData, setFormData] = useState({
    id_hotel: '',
    descripcion: '',
    descuento: '',
    fechainicio: '',
    fechafin: '',
    estado: 'Activo',
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
      await fetchPromociones();
    };

    loadData();
  }, [navigate, user, logout]);

  const fetchPromociones = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/promociones`);
      setPromociones(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error al obtener promociones:', error);
      setErrorMessage(error.response?.data?.error || 'Error al cargar las promociones. Intente de nuevo.');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar que los campos requeridos no estén vacíos
    if (!formData.id_hotel || !formData.descripcion || !formData.descuento || !formData.fechainicio || !formData.fechafin || !formData.estado) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios.',
        confirmButtonColor: '#0b7583',
      });
      return;
    }
    if (formData.descuento < 0 || formData.descuento > 100) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El descuento debe estar entre 0 y 100%.',
        confirmButtonColor: '#0b7583',
      });
      return;
    }

    try {
      const url = editingId ? `${API_BASE_URL}/api/promociones/${editingId}` : `${API_BASE_URL}/api/promociones`;
      const method = editingId ? 'put' : 'post';
      console.log('Enviando datos:', { ...formData }); // Depuración
      const response = await axios[method](url, {
        id_hotel: formData.id_hotel,
        descripcion: formData.descripcion,
        descuento: formData.descuento,
        fechainicio: formData.fechainicio,
        fechafin: formData.fechafin,
        estado: formData.estado,
      });
      await fetchPromociones();
      resetForm();
    } catch (error) {
      console.error('Error al guardar promoción:', error.response?.data || error);
      setErrorMessage(error.response?.data?.error || 'Error al guardar la promoción. Intente de nuevo.');
    }
  };

  const handleEdit = async (promocion) => {
    try {
      setFormData({
        id_hotel: promocion.id_hotel,
        descripcion: promocion.descripcion,
        descuento: promocion.descuento,
        fechainicio: promocion.fechainicio,
        fechafin: promocion.fechafin,
        estado: promocion.estado || 'Activo',
      });
      setEditingId(promocion.id_promocion);
      setOpenModal(true);
    } catch (error) {
      console.error('Error al obtener datos para edición:', error);
      setErrorMessage('Error al cargar los datos para edición.');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4c94bc',
      cancelButtonColor: '#f3a384',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/api/promociones/${id}`);
          await fetchPromociones();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'La promoción ha sido eliminada.',
            confirmButtonColor: '#0b7583',
          });
        } catch (error) {
          console.error('Error al eliminar promoción:', error);
          setErrorMessage(error.response?.data?.error || 'Error al eliminar la promoción. Intente de nuevo.');
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({
      id_hotel: '',
      descripcion: '',
      descuento: '',
      fechainicio: '',
      fechafin: '',
      estado: 'Activo',
    });
    setEditingId(null);
    setOpenModal(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, background: '#ffffff', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#0b7583', fontWeight: 'bold', mb: 4 }}>
        Gestión de Promociones
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
          Agregar Promoción
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
            {editingId ? 'Editar Promoción' : 'Agregar Nueva Promoción'}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <TextField
              label="Hotel"
              name="id_hotel"
              select
              value={formData.id_hotel}
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
            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiInputLabel-root': { color: '#549c94' } }}
            />
            <TextField
              label="Descuento (%)"
              name="descuento"
              type="number"
              value={formData.descuento}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
              inputProps={{ min: 0, max: 100 }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiInputLabel-root': { color: '#549c94' } }}
            />
            <TextField
              label="Fecha Inicio"
              name="fechainicio"
              type="date"
              value={formData.fechainicio}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiInputLabel-root': { color: '#549c94' } }}
            />
            <TextField
              label="Fecha Fin"
              name="fechafin"
              type="date"
              value={formData.fechafin}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiInputLabel-root': { color: '#549c94' } }}
            />
            <Select
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiInputLabel-root': { color: '#549c94' } }}
            >
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
            </Select>

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
        <Table sx={{ minWidth: 650 }} aria-label="promociones table">
          <TableHead sx={{ background: 'linear-gradient(135deg, #4c94bc, #549c94)' }}>
            <TableRow>
              {['Descripción', 'Descuento', 'Fecha Inicio', 'Fecha Fin', 'Hotel', 'Estado', 'Acciones'].map((head) => (
                <TableCell key={head} sx={{ fontWeight: '700', color: 'white', fontSize: '1rem' }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {promociones.length > 0 ? (
              promociones.map((promocion) => (
                <TableRow key={promocion.id_promocion} sx={{ '&:hover': { backgroundColor: '#b3c9ca20' } }}>
                  <TableCell sx={{ color: '#0b7583', fontWeight: '600' }}>{promocion.descripcion}</TableCell>
                  <TableCell sx={{ color: '#549c94', fontWeight: '500' }}>{promocion.descuento}%</TableCell>
                  <TableCell sx={{ color: '#549c94', fontWeight: '500' }}>{new Date(promocion.fechainicio).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ color: '#4c94bc', fontWeight: '500' }}>{new Date(promocion.fechafin).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ color: '#4c94bc', fontWeight: '500' }}>{promocion.nombrehotel}</TableCell>
                  <TableCell sx={{ color: promocion.estado === 'Activo' ? '#4caf50' : '#f44336', fontWeight: '500' }}>
                    {promocion.estado}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleEdit(promocion)} sx={{ backgroundColor: '#4c94bc', color: 'white' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(promocion.id_promocion)} sx={{ backgroundColor: '#f44336', color: 'white' }}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#b3c9ca' }}>
                  No hay promociones disponibles para este usuario.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Promociones;
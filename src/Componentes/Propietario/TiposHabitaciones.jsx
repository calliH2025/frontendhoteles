import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Chip,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../Autenticacion/AuthContext';

const MySwal = withReactContent(Swal);

const theme = createTheme({
  palette: {
    primary: {
      main: "#4c94bc",
      light: "#7bb3d3",
      dark: "#2c5f73",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0b7583",
      light: "#549c94",
      dark: "#064952",
      contrastText: "#ffffff",
    },
    info: {
      main: "#b3c9ca",
      light: "#d4e3e4",
      dark: "#8ba1a3",
    },
    warning: {
      main: "#f3a384",
      light: "#f7bfa6",
      dark: "#e07650",
    },
    background: {
      default: "linear-gradient(135deg, #f5f8fa 0%, #e8f4f8 100%)",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#5a6c7d",
    }
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: {
      fontWeight: 700,
      color: "#2c3e50",
      letterSpacing: "-0.5px",
    },
    h5: {
      fontWeight: 600,
      color: "#2c3e50",
      letterSpacing: "-0.3px",
    },
    h6: {
      fontWeight: 600,
      color: "#34495e",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          boxShadow: '0 4px 12px rgba(76, 148, 188, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(76, 148, 188, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #4c94bc 0%, #0b7583 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5fa5cd 0%, #0d8994 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#f8fbfc',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#f0f7fa',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4c94bc',
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: '0 0 0 3px rgba(76, 148, 188, 0.1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4c94bc',
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: '#5a6c7d',
            '&.Mui-focused': {
              color: '#4c94bc',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#f8fbfc',
          color: '#2c3e50',
          fontWeight: 600,
          fontSize: '0.9rem',
          borderBottom: '2px solid #e1ecf0',
        },
        body: {
          fontSize: '0.85rem',
          color: '#34495e',
          borderBottom: '1px solid #f0f4f7',
        },
      },
    },
  },
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: '0 24px 80px rgba(0, 0, 0, 0.12)',
  p: 0,
  maxHeight: '90vh',
  overflow: 'hidden',
};

const API_BASE_URL = "https://backendreservas-m2zp.onrender.com"; // Cambia esto según tu configuración

function Tipohabitacion() {
  const [tipoHabitacion, setTipoHabitacion] = useState({
    tipohabitacion: '',
    precioHora: '',
    precioDia: '',
    precioNoche: '',
    precioSemana: ''
  });
  const [errors, setErrors] = useState({
    tipohabitacion: '',
    precioHora: '',
    precioDia: '',
    precioNoche: '',
    precioSemana: ''
  });
  const [tipos, setTipos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user || user.Tipousuario !== 'Propietario') {
      return; // Redirigir o manejar si no es propietario
    }
    fetchTipos();
  }, [user]);

  const fetchTipos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tipohabitacion`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTipos(response.data);
    } catch (error) {
      console.error('Error al obtener tipos de habitación:', error.message, error.response?.status, error.response?.data);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudieron cargar los tipos de habitación. Código: ${error.response?.status || 'Desconocido'}. Detalle: ${error.message}`,
        confirmButtonColor: "#4c94bc",
      });
    }
  };

  const validateTipoHabitacion = (value) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!value) {
      return "El nombre del tipo de habitación es requerido.";
    }
    if (!regex.test(value)) {
      return "Solo se permiten letras y espacios (sin espacios al inicio o final).";
    }
    if (value.trim() !== value) {
      return "No se permiten espacios al inicio o final.";
    }
    return "";
  };

  const validatePrice = (value, fieldName) => {
    if (!value) {
      return `El ${fieldName} es requerido.`;
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return `El ${fieldName} debe ser un número válido.`;
    }
    if (num <= 0) {
      return `El ${fieldName} debe ser mayor a 0.`;
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTipoHabitacion(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar en tiempo real
    let error = "";
    if (name === "tipohabitacion") {
      error = validateTipoHabitacion(value);
    } else {
      const fieldName = name === "precioHora" ? "precio por hora" :
                        name === "precioDia" ? "precio por día" :
                        name === "precioNoche" ? "precio por noche" :
                        "precio por semana";
      error = validatePrice(value, fieldName);
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    const newErrors = {
      tipohabitacion: validateTipoHabitacion(tipoHabitacion.tipohabitacion),
      precioHora: validatePrice(tipoHabitacion.precioHora, "precio por hora"),
      precioDia: validatePrice(tipoHabitacion.precioDia, "precio por día"),
      precioNoche: validatePrice(tipoHabitacion.precioNoche, "precio por noche"),
      precioSemana: validatePrice(tipoHabitacion.precioSemana, "precio por semana")
    };

    setErrors(newErrors);

    // Verificar si hay errores
    if (Object.values(newErrors).some(error => error !== "")) {
      MySwal.fire({
        icon: "error",
        title: "Campos inválidos",
        text: "Por favor, corrige los errores en el formulario.",
        confirmButtonColor: "#4c94bc",
      });
      return;
    }

    try {
      const data = {
        tipohabitacion: tipoHabitacion.tipohabitacion,
        precioHora: parseFloat(tipoHabitacion.precioHora),
        precioDia: parseFloat(tipoHabitacion.precioDia),
        precioNoche: parseFloat(tipoHabitacion.precioNoche),
        precioSemana: parseFloat(tipoHabitacion.precioSemana)
      };

      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/tipohabitacion/${editingId}`, data, config);
        MySwal.fire({
          icon: "success",
          title: "¡Perfecto!",
          text: "Tipo de habitación actualizado correctamente.",
          confirmButtonColor: "#4c94bc",
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/tipohabitacion`, data, config);
        MySwal.fire({
          icon: "success",
          title: "¡Excelente!",
          text: "Tipo de habitación creado correctamente.",
          confirmButtonColor: "#4c94bc",
        });
      }

      setTipoHabitacion({
        tipohabitacion: '',
        precioHora: '',
        precioDia: '',
        precioNoche: '',
        precioSemana: ''
      });
      setErrors({
        tipohabitacion: '',
        precioHora: '',
        precioDia: '',
        precioNoche: '',
        precioSemana: ''
      });
      setEditingId(null);
      setShowModal(false);
      fetchTipos();
    } catch (error) {
      console.error('Error al guardar tipo de habitación:', error.message, error.response?.status, error.response?.data);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo guardar el tipo de habitación. Código: ${error.response?.status || 'Desconocido'}. Detalle: ${error.message}`,
        confirmButtonColor: "#4c94bc",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto después de eliminarlo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#4c94bc',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      borderRadius: '16px',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/api/tipohabitacion/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTipos(tipos.filter(t => t.id_tipohabitacion !== id));
        MySwal.fire({
          title: '¡Eliminado!',
          text: 'Tipo de habitación eliminado correctamente.',
          icon: 'success',
          confirmButtonColor: "#4c94bc",
        });
      } catch (error) {
        console.error('Error al eliminar tipo de habitación:', error.message, error.response?.status, error.response?.data);
        MySwal.fire({
          title: 'Error!',
          text: `Hubo un problema al intentar eliminar el tipo de habitación. Código: ${error.response?.status || 'Desconocido'}. Detalle: ${error.message}`,
          icon: 'error',
          confirmButtonColor: "#4c94bc",
        });
      }
    }
  };

  const handleEdit = (tipo) => {
    setTipoHabitacion({
      tipohabitacion: tipo.tipohabitacion || '',
      precioHora: tipo.precioHora ? tipo.precioHora.toString() : '',
      precioDia: tipo.precioDia ? tipo.precioDia.toString() : '',
      precioNoche: tipo.precioNoche ? tipo.precioNoche.toString() : '',
      precioSemana: tipo.precioSemana ? tipo.precioSemana.toString() : ''
    });
    setErrors({
      tipohabitacion: '',
      precioHora: '',
      precioDia: '',
      precioNoche: '',
      precioSemana: ''
    });
    setEditingId(tipo.id_tipohabitacion);
    setShowModal(true);
  };

  const handleCancel = () => {
    setTipoHabitacion({
      tipohabitacion: '',
      precioHora: '',
      precioDia: '',
      precioNoche: '',
      precioSemana: ''
    });
    setErrors({
      tipohabitacion: '',
      precioHora: '',
      precioDia: '',
      precioNoche: '',
      precioSemana: ''
    });
    setEditingId(null);
    setShowModal(false);
  };

  const handleAddNew = () => {
    setTipoHabitacion({
      tipohabitacion: '',
      precioHora: '',
      precioDia: '',
      precioNoche: '',
      precioSemana: ''
    });
    setErrors({
      tipohabitacion: '',
      precioHora: '',
      precioDia: '',
      precioNoche: '',
      precioSemana: ''
    });
    setEditingId(null);
    setShowModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const isFormValid = () => {
    return (
      tipoHabitacion.tipohabitacion &&
      tipoHabitacion.precioHora &&
      tipoHabitacion.precioDia &&
      tipoHabitacion.precioNoche &&
      tipoHabitacion.precioSemana &&
      !errors.tipohabitacion &&
      !errors.precioHora &&
      !errors.precioDia &&
      !errors.precioNoche &&
      !errors.precioSemana
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f8fa 0%, #e8f4f8 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2,
                background: 'linear-gradient(135deg, #4c94bc 0%, #0b7583 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 800,
              }}
            >
              Gestión de Tipos de Habitaciones
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Administra los tipos de habitaciones y sus precios de manera eficiente
            </Typography>
          </Box>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 0,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <Box sx={{ 
              background: 'linear-gradient(135deg, #4c94bc 0%, #0b7583 100%)',
              color: 'white',
              p: 3,
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
            }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Tipos de Habitación
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {tipos.length} habitaciones registradas
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleAddNew}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Nueva Habitación
              </Button>
            </Box>

            <Box sx={{ p: 3 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo de Habitación</TableCell>
                    <TableCell align="center">Precio Hora</TableCell>
                    <TableCell align="center">Precio Día</TableCell>
                    <TableCell align="center">Precio Noche</TableCell>
                    <TableCell align="center">Precio Semana</TableCell>
                    <TableCell align="center">Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tipos.map((tipo) => (
                    <TableRow 
                      key={tipo.id_tipohabitacion}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: '#f8fbfc',
                          transform: 'scale(1.005)',
                          transition: 'all 0.2s ease',
                        },
                        '&:nth-of-type(even)': {
                          backgroundColor: '#fafcfd',
                        }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                          {tipo.tipohabitacion}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ color: '#4c94bc', fontWeight: 600 }}>
                          {formatPrice(tipo.precioHora)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ color: '#4c94bc', fontWeight: 600 }}>
                          {formatPrice(tipo.precioDia)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ color: '#4c94bc', fontWeight: 600 }}>
                          {formatPrice(tipo.precioNoche)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ color: '#4c94bc', fontWeight: 600 }}>
                          {formatPrice(tipo.precioSemana)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={tipo.estado}
                          size="small"
                          sx={{
                            backgroundColor: tipo.estado === 'activo' ? '#549c94' : '#b3c9ca',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            onClick={() => handleEdit(tipo)}
                            size="small"
                            sx={{ 
                              backgroundColor: '#4c94bc',
                              color: 'white',
                              width: 36,
                              height: 36,
                              '&:hover': {
                                backgroundColor: '#3a7a9c',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(tipo.id_tipohabitacion)}
                            size="small"
                            sx={{ 
                              backgroundColor: '#e74c3c',
                              color: 'white',
                              width: 36,
                              height: 36,
                              '&:hover': {
                                backgroundColor: '#c0392b',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>

          <Modal
            open={showModal}
            onClose={handleCancel}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
              sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
            }}
          >
            <Fade in={showModal}>
              <Box sx={modalStyle}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #4c94bc 0%, #0b7583 100%)',
                  color: 'white',
                  p: 3,
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {editingId ? 'Editar Habitación' : 'Nueva Habitación'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {editingId ? 'Actualiza la información' : 'Completa todos los campos'}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={handleCancel}
                    sx={{ 
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': { 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Box sx={{ p: 4 }}>
                  <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'grid', gap: 3 }}>
                      <TextField
                        fullWidth
                        label="Nombre del Tipo de Habitación"
                        name="tipohabitacion"
                        value={tipoHabitacion.tipohabitacion}
                        onChange={handleChange}
                        required
                        placeholder="Ej: Suite Ejecutiva, Habitación Estándar..."
                        error={!!errors.tipohabitacion}
                        helperText={errors.tipohabitacion}
                      />
                      
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                        gap: 2 
                      }}>
                        <TextField
                          fullWidth
                          label="Precio por Hora"
                          name="precioHora"
                          type="number"
                          value={tipoHabitacion.precioHora}
                          onChange={handleChange}
                          required
                          placeholder="0.00"
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1, color: '#4c94bc', fontWeight: 600 }}>$</Typography>,
                            inputProps: { min: 0, step: "0.01" }
                          }}
                          error={!!errors.precioHora}
                          helperText={errors.precioHora}
                        />
                        <TextField
                          fullWidth
                          label="Precio por Día"
                          name="precioDia"
                          type="number"
                          value={tipoHabitacion.precioDia}
                          onChange={handleChange}
                          required
                          placeholder="0.00"
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1, color: '#4c94bc', fontWeight: 600 }}>$</Typography>,
                            inputProps: { min: 0, step: "0.01" }
                          }}
                          error={!!errors.precioDia}
                          helperText={errors.precioDia}
                        />
                      </Box>

                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                        gap: 2 
                      }}>
                        <TextField
                          fullWidth
                          label="Precio por Noche"
                          name="precioNoche"
                          type="number"
                          value={tipoHabitacion.precioNoche}
                          onChange={handleChange}
                          required
                          placeholder="0.00"
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1, color: '#4c94bc', fontWeight: 600 }}>$</Typography>,
                            inputProps: { min: 0, step: "0.01" }
                          }}
                          error={!!errors.precioNoche}
                          helperText={errors.precioNoche}
                        />
                        <TextField
                          fullWidth
                          label="Precio por Semana"
                          name="precioSemana"
                          type="number"
                          value={tipoHabitacion.precioSemana}
                          onChange={handleChange}
                          required
                          placeholder="0.00"
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1, color: '#4c94bc', fontWeight: 600 }}>$</Typography>,
                            inputProps: { min: 0, step: "0.01" }
                          }}
                          error={!!errors.precioSemana}
                          helperText={errors.precioSemana}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      justifyContent: 'flex-end',
                      mt: 4,
                      pt: 3,
                      borderTop: '1px solid #e1ecf0'
                    }}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{ 
                          px: 4, 
                          py: 1.5,
                          borderColor: '#b3c9ca',
                          color: '#5a6c7d',
                          '&:hover': {
                            borderColor: '#4c94bc',
                            backgroundColor: 'rgba(76, 148, 188, 0.05)',
                          }
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!isFormValid()}
                        sx={{ 
                          px: 4, 
                          py: 1.5,
                          minWidth: 120,
                        }}
                      >
                        {editingId ? 'Actualizar' : 'Crear Habitación'}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Box>
            </Fade>
          </Modal>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Tipohabitacion;
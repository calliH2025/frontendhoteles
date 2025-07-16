import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Grid,
  Alert,
  Snackbar,
  Tooltip,
  Avatar,
  Stack,
  CircularProgress,
  TextField,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  Campaign as CampaignIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";

const GestionPromociones = () => {
  const [tabValue, setTabValue] = useState(0);
  const [promociones, setPromociones] = useState([]);
  const [estadisticasData, setEstadisticasData] = useState([]);
  const [usosData, setUsosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [error, setError] = useState(null);
  const [filtroPropietario, setFiltroPropietario] = useState(""); // Estado para el filtro de propietario

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [promocionesRes, statsRes] = await Promise.all([
          axios.get('https://backendreservas-m2zp.onrender.com/api/gestionpromocionesadmin/list'),
          axios.get('https://backendreservas-m2zp.onrender.com/api/gestionpromocionesadmin/stats'),
        ]);
        console.log('Promociones:', promocionesRes.data); // Depuración
        console.log('Estadísticas:', statsRes.data); // Depuración
        setPromociones(promocionesRes.data);
        setEstadisticasData(statsRes.data.estadisticasData);
        setUsosData(statsRes.data.usosData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError('No se pudieron cargar las promociones. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFiltroPropietarioChange = (event) => {
    setFiltroPropietario(event.target.value);
  };

  const handleDelete = async (id, estado) => {
    console.log(`Intentando eliminar promoción con ID: ${id}, estado: ${estado}`); // Depuración
    if (estado !== 'inactivo') {
      setSnackbar({ open: true, message: 'Solo se pueden eliminar promociones inactivas', severity: 'error' });
      return;
    }
    try {
      const response = await axios.delete(`https://backendreservas-m2zp.onrender.com/api/gestionpromocionesadmin/delete/${id}`);
      console.log('Respuesta de eliminación:', response.data); // Depuración
      setPromociones((prev) => prev.filter((p) => p.id !== id));
      setSnackbar({ open: true, message: 'Promoción eliminada exitosamente', severity: 'success' });
    } catch (error) {
      console.error('Error al eliminar promoción:', error.response?.data || error.message);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Error al eliminar promoción', 
        severity: 'error' 
      });
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'inactivo':
        return 'Inactivo';
      default:
        return estado;
    }
  };

  const filteredPromociones = () => {
    let filtered = promociones;
    
    // Aplicar filtro por pestaña
    switch (tabValue) {
      case 0:
        filtered = promociones; // Todas
        break;
      case 1:
        filtered = promociones.filter((p) => p.tipo === 'propietario'); // Propietarios
        break;
      case 2:
        filtered = promociones.filter((p) => p.estado === 'activo'); // Activas
        break;
      case 3:
        filtered = promociones.filter((p) => p.estado === 'inactivo'); // Inactivas
        break;
      default:
        filtered = promociones;
    }

    // Aplicar filtro por propietario
    if (filtroPropietario.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.propietario.toLowerCase().includes(filtroPropietario.toLowerCase())
      );
    }

    return filtered;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CampaignIcon fontSize="large" color="primary" />
          Gestión de Promociones
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Administra promociones globales y de propietarios
        </Typography>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Uso de Promociones
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={usosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="usos" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado de Promociones
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={estadisticasData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                    {estadisticasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtro por Propietario */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Filtrar por Propietario"
          variant="outlined"
          value={filtroPropietario}
          onChange={handleFiltroPropietarioChange}
          fullWidth
          sx={{ maxWidth: 400 }}
          placeholder="Escribe el nombre del propietario"
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Todas" />
          <Tab label="Propietarios" />
          <Tab label="Activas" />
          <Tab label="Inactivas" />
        </Tabs>
      </Box>

      {/* Tabla de Promociones */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Promoción</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descuento</TableCell>
                <TableCell>Vigencia</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Propietario</TableCell>
                <TableCell>Usos</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPromociones().map((promocion) => (
                <TableRow key={promocion.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {promocion.titulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {promocion.descripcion}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={promocion.tipo === 'global' ? <TrendingUpIcon /> : <StoreIcon />}
                      label={promocion.tipo === 'global' ? 'Global' : 'Propietario'}
                      variant="outlined"
                      color={promocion.tipo === 'global' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" color="primary">
                      {promocion.descuento}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(promocion.fechaInicio).toLocaleDateString()} -{' '}
                      {new Date(promocion.fechaFin).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(promocion.estado)}
                      color={getStatusColor(promocion.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {promocion.propietario.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{promocion.propietario}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{promocion.usos} usos</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {promocion.propiedadesAplicadas} propiedades
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={promocion.estado === 'inactivo' ? 'Eliminar' : 'No disponible (solo inactivas)'}>
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(promocion.id, promocion.estado)}
                            disabled={promocion.estado !== 'inactivo'}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GestionPromociones;
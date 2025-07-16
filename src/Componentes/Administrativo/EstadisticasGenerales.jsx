import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Hotel, People, AttachMoney, EventAvailable, Visibility } from "@mui/icons-material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import axios from "axios";

const HotelDashboard = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [generalStats, setGeneralStats] = useState({
    totalUsers: { admin: 0, hotelOwner: 0, guest: 0 },
    totalHotels: 0,
    generalOccupancy: 0,
    estimatedRevenue: 0,
  });
  const [reservationData, setReservationData] = useState([]);
  const [userTypeData, setUserTypeData] = useState([]);
  const [topHotels, setTopHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, reservationRes, userTypeRes, hotelsRes] = await Promise.all([
          axios.get('https://backendreservas-m2zp.onrender.com/api/gestionestadisticasadmin/general-stats'),
          axios.get('https://backendreservas-m2zp.onrender.com/api/gestionestadisticasadmin/reservation-data'),
          axios.get('https://backendreservas-m2zp.onrender.com/api/gestionestadisticasadmin/user-type-data'),
          axios.get('https://backendreservas-m2zp.onrender.com/api/gestionestadisticasadmin/top-hotels'),
        ]);
        console.log('General Stats:', statsRes.data); // Depuración
        setGeneralStats(statsRes.data);
        setReservationData(reservationRes.data);
        setUserTypeData(userTypeRes.data);
        setTopHotels(hotelsRes.data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError('No se pudieron cargar las estadísticas. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" sx={{ color: color, fontWeight: 'bold' }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getReservationData = () => {
    switch (tabValue) {
      case 0:
        return reservationData.map((item) => ({ ...item, value: item.daily }));
      case 1:
        return reservationData.map((item) => ({ ...item, value: item.weekly }));
      case 2:
        return reservationData.map((item) => ({ ...item, value: item.monthly }));
      default:
        return reservationData.map((item) => ({ ...item, value: item.daily }));
    }
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
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Estadísticas Generales
      </Typography>

      {/* Estadísticas Generales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Hoteles"
            value={generalStats.totalHotels.toLocaleString() || '0'}
            icon={<Hotel />}
            color="#1976d2"
            subtitle="Registrados en el sistema"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Usuarios"
            value={Object.values(generalStats.totalUsers)
              .reduce((a, b) => a + b, 0)
              .toLocaleString() || '0'}
            icon={<People />}
            color="#388e3c"
            subtitle="Usuarios activos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ocupación General"
            value={`${generalStats.generalOccupancy || '0'}%`}
            icon={<EventAvailable />}
            color="#f57c00"
            subtitle="Promedio del sistema"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ingresos Estimados"
            value={formatCurrency(generalStats.estimatedRevenue)}
            icon={<AttachMoney />}
            color="#7b1fa2"
            subtitle="Este mes"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Usuarios por Tipo */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Distribución de Usuarios por Tipo
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Reservas por Período */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Reservas por Período
              </Typography>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                <Tab label="Diario" />
                <Tab label="Semanal" />
                <Tab label="Mensual" />
              </Tabs>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={getReservationData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="url(#colorGradient)" />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Hoteles con Más Actividad */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Hoteles con Más Actividad
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Hotel</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Ubicación</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Reservas
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Ingresos
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Ocupación
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topHotels.map((hotel, index) => (
                      <TableRow
                        key={hotel.id}
                        sx={{
                          '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
                          '&:nth-of-type(odd)': { backgroundColor: alpha(theme.palette.grey[500], 0.05) },
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>{index + 1}</Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {hotel.name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{hotel.location}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={hotel.reservations.toLocaleString()}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'green' }}>
                            {formatCurrency(hotel.revenue)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${hotel.occupancy}%`}
                            color={hotel.occupancy > 85 ? 'success' : hotel.occupancy > 70 ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HotelDashboard;
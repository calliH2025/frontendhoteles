"use client"

import { useState } from "react"
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
} from "@mui/material"
import { Hotel, People, AttachMoney, EventAvailable, Star, Visibility } from "@mui/icons-material"
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
} from "recharts"

const HotelDashboard = () => {
  const theme = useTheme()
  const [tabValue, setTabValue] = useState(0)

  // Datos de ejemplo
  const generalStats = {
    totalUsers: {
      admin: 15,
      hotelOwner: 234,
      guest: 12847,
    },
    totalHotels: 456,
    generalOccupancy: 78.5,
    estimatedRevenue: 2847392,
  }

  const reservationData = [
    { period: "Lun", daily: 45, weekly: 315, monthly: 1350 },
    { period: "Mar", daily: 52, weekly: 364, monthly: 1560 },
    { period: "Mié", daily: 38, weekly: 266, monthly: 1140 },
    { period: "Jue", daily: 61, weekly: 427, monthly: 1830 },
    { period: "Vie", daily: 73, weekly: 511, monthly: 2190 },
    { period: "Sáb", daily: 89, weekly: 623, monthly: 2670 },
    { period: "Dom", daily: 67, weekly: 469, monthly: 2010 },
  ]

  const userTypeData = [
    { name: "Huéspedes", value: generalStats.totalUsers.guest, color: "#8884d8" },
    { name: "Propietarios", value: generalStats.totalUsers.hotelOwner, color: "#82ca9d" },
    { name: "Administradores", value: generalStats.totalUsers.admin, color: "#ffc658" },
  ]

  const topHotels = [
    {
      id: 1,
      name: "Hotel Paradise Resort",
      location: "Cancún, México",
      reservations: 234,
      revenue: 145000,
      rating: 4.8,
      occupancy: 92,
    },
    {
      id: 2,
      name: "Grand Plaza Hotel",
      location: "Ciudad de México",
      reservations: 198,
      revenue: 128000,
      rating: 4.6,
      occupancy: 87,
    },
    {
      id: 3,
      name: "Beachfront Suites",
      location: "Playa del Carmen",
      reservations: 176,
      revenue: 112000,
      rating: 4.7,
      occupancy: 84,
    },
    {
      id: 4,
      name: "Mountain View Lodge",
      location: "Guadalajara",
      reservations: 154,
      revenue: 98000,
      rating: 4.5,
      occupancy: 79,
    },
    {
      id: 5,
      name: "City Center Hotel",
      location: "Monterrey",
      reservations: 142,
      revenue: 89000,
      rating: 4.4,
      occupancy: 76,
    },
  ]

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
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
            <Typography variant="h4" component="h2" sx={{ color: color, fontWeight: "bold" }}>
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
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getReservationData = () => {
    switch (tabValue) {
      case 0:
        return reservationData.map((item) => ({ ...item, value: item.daily }))
      case 1:
        return reservationData.map((item) => ({ ...item, value: item.weekly }))
      case 2:
        return reservationData.map((item) => ({ ...item, value: item.monthly }))
      default:
        return reservationData.map((item) => ({ ...item, value: item.daily }))
    }
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
        Estadísticas General
      </Typography>

      {/* Estadísticas Generales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Hoteles"
            value={generalStats.totalHotels.toLocaleString()}
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
              .toLocaleString()}
            icon={<People />}
            color="#388e3c"
            subtitle="Usuarios activos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ocupación General"
            value={`${generalStats.generalOccupancy}%`}
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
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
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
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
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
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
                Hoteles con Más Actividad
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Hotel</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Ubicación</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Reservas
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Ingresos
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Rating
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Ocupación
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topHotels.map((hotel, index) => (
                      <TableRow
                        key={hotel.id}
                        sx={{
                          "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
                          "&:nth-of-type(odd)": { backgroundColor: alpha(theme.palette.grey[500], 0.05) },
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>{index + 1}</Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
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
                          <Typography variant="body2" sx={{ fontWeight: "bold", color: "green" }}>
                            {formatCurrency(hotel.revenue)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <Star sx={{ color: "#ffc107", mr: 0.5, fontSize: 16 }} />
                            <Typography variant="body2">{hotel.rating}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${hotel.occupancy}%`}
                            color={hotel.occupancy > 85 ? "success" : hotel.occupancy > 70 ? "warning" : "error"}
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
  )
}

export default HotelDashboard;

import { Card, CardContent, Button, Typography, Grid, Box, Chip, Paper, Container } from "@mui/material"
import {
  Person as PersonIcon,
  LocalOffer as TagIcon,
  CalendarToday as CalendarIcon,
  BarChart as BarChartIcon,
  Business as BuildingIcon,
  AttachMoney as DollarIcon,
  CreditCard as CreditCardIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material"

export default function Propietario() {
  const menuItems = [
    {
      title: "Perfil",
      description: "Gestiona tu información personal y configuración de cuenta",
      icon: PersonIcon,
      color: "#1976d2",
      gradient: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
    },
    {
      title: "Promociones",
      description: "Crea y administra ofertas especiales para tus propiedades",
      icon: TagIcon,
      color: "#388e3c",
      gradient: "linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)",
    },
    {
      title: "Gestión Reservas",
      description: "Administra todas las reservas y disponibilidad de tus hoteles",
      icon: CalendarIcon,
      color: "#7b1fa2",
      gradient: "linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%)",
    },
    {
      title: "Reportes",
      description: "Analiza el rendimiento y estadísticas de tus propiedades",
      icon: BarChartIcon,
      color: "#f57c00",
      gradient: "linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)",
    },
    {
      title: "Hoteles",
      description: "Administra la información y servicios de tus hoteles",
      icon: BuildingIcon,
      color: "#303f9f",
      gradient: "linear-gradient(135deg, #303f9f 0%, #283593 100%)",
    },
    {
      title: "Tarifas",
      description: "Configura precios y tarifas para diferentes temporadas",
      icon: DollarIcon,
      color: "#00796b",
      gradient: "linear-gradient(135deg, #00796b 0%, #00695c 100%)",
    },
    {
      title: "Conexión Mercado Pago",
      description: "Integra y configura pagos con Mercado Pago",
      icon: CreditCardIcon,
      color: "#0097a7",
      gradient: "linear-gradient(135deg, #0097a7 0%, #00838f 100%)",
    },
  ]

  const stats = [
    { value: "24", label: "Reservas Activas", color: "#1976d2" },
    { value: "$45,280", label: "Ingresos del Mes", color: "#388e3c" },
    { value: "89%", label: "Ocupación Promedio", color: "#7b1fa2" },
    { value: "4.8", label: "Calificación Promedio", color: "#f57c00" },
  ]

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            color="text.primary"
            mb={2}
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              background: "linear-gradient(45deg, #1976d2, #7b1fa2)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Portal del Propietario
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={3} sx={{ maxWidth: "600px", mx: "auto" }}>
            Gestiona todos los aspectos de tu negocio hotelero desde un solo lugar
          </Typography>
          <Chip label="Dashboard Principal" color="primary" variant="outlined" sx={{ fontWeight: "medium" }} />
        </Box>

        {/* Menu Cards Grid */}
        <Grid container spacing={3} mb={6}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                    },
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: item.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <IconComponent sx={{ fontSize: 32, color: "white" }} />
                    </Box>

                    <Typography variant="h6" component="h3" fontWeight="bold" mb={1} color="text.primary">
                      {item.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={3}
                      sx={{ minHeight: "48px", lineHeight: 1.4 }}
                    >
                      {item.description}
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        background: item.gradient,
                        "&:hover": {
                          background: item.gradient,
                          opacity: 0.9,
                          transform: "scale(1.02)",
                        },
                        borderRadius: 2,
                        py: 1,
                        fontWeight: "medium",
                      }}
                    >
                      Acceder
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        {/* Quick Stats */}
        <Grid container spacing={3} mb={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <Typography variant="h4" component="div" fontWeight="bold" sx={{ color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Welcome Message */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" component="h2" fontWeight="bold" mb={2}>
              ¡Bienvenido de vuelta!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: "600px", mx: "auto" }}>
              Tienes 3 nuevas reservas pendientes de confirmación y 2 promociones por vencer esta semana.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                  },
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Ver Reservas Pendientes
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Gestionar Promociones
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

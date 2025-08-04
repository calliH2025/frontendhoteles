import { Box, Grid, Card, CardContent, Typography, Avatar, CardActionArea, Container } from "@mui/material"
import { useNavigate } from "react-router-dom"
import {
  Person,
  People,
  Hotel,
  CalendarToday,
  BarChart,
  LocalOffer,
  Payment,
  Business,
  Description,
  Security,
  Visibility,
  EmojiObjects,
} from "@mui/icons-material"

// Datos de las tarjetas de navegación
const navigationCards = [
  {
    title: "Perfil",
    description: "Gestiona tu información personal y configuración de cuenta",
    icon: Person,
    color: "#1976d2",
    route: "/admin/perfilusuario",
  },
  {
    title: "Gestión de Usuarios",
    description: "Administra usuarios, roles y permisos del sistema",
    icon: People,
    color: "#388e3c",
    route: "/admin/gestionusuarios",
  },
  {
    title: "Gestión de Hoteles",
    description: "Administra propiedades, habitaciones y servicios",
    icon: Hotel,
    color: "#f57c00",
    route: "/admin/gestionhoteles",
  },
  {
    title: "Gestión Reservas",
    description: "Controla reservas, check-in, check-out y cancelaciones",
    icon: CalendarToday,
    color: "#7b1fa2",
    route: "/admin/gestionreservasad",
  },
  {
    title: "Estadísticas",
    description: "Visualiza reportes y métricas de rendimiento",
    icon: BarChart,
    color: "#d32f2f",
    route: "/admin/estadisticas",
  },
  {
    title: "Gestión de Promociones",
    description: "Crea y administra ofertas, descuentos y promociones",
    icon: LocalOffer,
    color: "#1976d2",
    route: "/admin/gestionpromociones",
  },
  {
    title: "Método de Pago",
    description: "Configura métodos de pago y procesamiento",
    icon: Payment,
    color: "#388e3c",
    route: "/admin/metodopago",
  },
  {
    title: "Perfil Empresa",
    description: "Información corporativa y datos de la empresa",
    icon: Business,
    color: "#f57c00",
    route: "/admin/perfil",
  },
  {
    title: "Términos",
    description: "Términos y condiciones de uso del servicio",
    icon: Description,
    color: "#7b1fa2",
    route: "/admin/terminos",
  },
  {
    title: "Políticas",
    description: "Políticas de privacidad y tratamiento de datos",
    icon: Security,
    color: "#d32f2f",
    route: "/admin/politicas",
  },
  {
    title: "Misión",
    description: "Misión y propósito de la organización",
    icon: Visibility,
    color: "#1976d2",
    route: "/admin/mision",
  },
  {
    title: "Visión",
    description: "Visión y objetivos a futuro de la empresa",
    icon: EmojiObjects,
    color: "#388e3c",
    route: "/admin/vision",
  },
]

export default function AdminHome() {
  const navigate = useNavigate()

  const handleCardClick = (route) => {
    navigate(route)
  }
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              mb: 2,
            }}
          >
            Panel de Administración
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            Selecciona una opción para gestionar tu sistema de reservas de alojamientos
          </Typography>
        </Box>

        {/* Navigation Cards Grid */}
        <Grid container spacing={3} justifyContent="center">
          {navigationCards.map((card, index) => {
            const IconComponent = card.icon
            return (
              <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                                 <Card
                   sx={{
                     height: "280px",
                     width: "100%",
                     maxWidth: "350px",
                     transition: "all 0.3s ease-in-out",
                     "&:hover": {
                       transform: "translateY(-8px)",
                       boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                     },
                   }}
                 >
                  <CardActionArea onClick={() => handleCardClick(card.route)} sx={{ height: "100%", p: 0 }}>
                    <CardContent
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        p: 3,
                      }}
                    >
                      {/* Icon */}
                      <Avatar
                        sx={{
                          bgcolor: card.color,
                          width: 64,
                          height: 64,
                          mb: 2,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                      >
                        <IconComponent sx={{ fontSize: 32 }} />
                      </Avatar>

                      {/* Title */}
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: "bold",
                          color: "#333",
                          mb: 1,
                        }}
                      >
                        {card.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.5,
                          flexGrow: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {card.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  )
}

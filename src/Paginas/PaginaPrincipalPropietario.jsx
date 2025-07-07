import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Fade,
  Slide,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
} from "@mui/material";
import { Business, EventSeat, PieChart, ArrowForward, Star } from "@mui/icons-material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#f59e0b", // Amber
      light: "#fde68a",
      dark: "#c77e0b",
    },
    secondary: {
      main: "#6b7280", // Slate
      light: "#d1d5db",
      dark: "#4b5563",
    },
    background: {
      default: "#f5f7fa", // Very light gradient base
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#475569",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: "3.5rem",
      letterSpacing: "-0.5px",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.25rem",
      color: "#f59e0b",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#6b7280",
    },
    body1: {
      fontSize: "1.1rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
  },
});

const MotionCard = motion(Card);

const PaginaPrincipalPropietario = () => {
  const muiTheme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f9fafb 0%, #e0e7ff 100%)",
          color: muiTheme.palette.text.primary,
          py: 10,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle background decoration */}
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "120%",
            height: "120%",
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Fade in timeout={1500}>
            <Box sx={{ textAlign: "center", mb: 10 }}>
              <Typography variant="h1" gutterBottom sx={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.1)" }}>
                Panel del Propietario
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  maxWidth: "700px",
                  mx: "auto",
                  color: muiTheme.palette.text.secondary,
                  fontWeight: 500,
                  mb: 4,
                }}
              >
                Toma el control total de tus propiedades, gestiona reservas y descubre insights valiosos con un diseño elegante y funcional.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 4, py: 1.5, borderRadius: 12 }}
              >
                ¡Explora Ahora!
              </Button>
            </Box>
          </Fade>

          <Slide in timeout={1500} direction="up">
            <Grid container spacing={6}>
              {[
                { title: "Gestionar Propiedades", desc: "Actualiza y supervisa tus hoteles con facilidad.", icon: Business },
                { title: "Controlar Reservas", desc: "Revisa y administra las reservas de tus alojamientos.", icon: EventSeat },
                { title: "Analizar Reportes", desc: "Explora estadísticas financieras detalladas y personalizadas.", icon: PieChart },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <MotionCard
                    whileHover={{ scale: 1.08 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    elevation={6}
                    sx={{
                      borderRadius: 16,
                      background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 120,
                        background: `linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(107, 114, 128, 0.05) 100%)`,
                      }}
                    />
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
                        <item.icon sx={{ fontSize: "3rem", color: index === 2 ? muiTheme.palette.secondary.main : muiTheme.palette.primary.main }} />
                        {index === 0 && (
                          <IconButton sx={{ position: "absolute", top: 10, right: 10 }}>
                            <Star color="primary" />
                          </IconButton>
                        )}
                      </Box>
                      <Typography variant="h2" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        {item.desc}
                      </Typography>
                      <Button
                        variant="contained"
                        color={index === 2 ? "secondary" : "primary"}
                        endIcon={<ArrowForward />}
                        sx={{ mt: 2, px: 3, py: 1.5, borderRadius: 12 }}
                      >
                        {item.title}
                      </Button>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </Slide>

          <Divider sx={{ my: 8, borderColor: "rgba(107, 114, 128, 0.2)" }} />

          <Fade in timeout={1500}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography variant="h3" gutterBottom>
                Tu éxito comienza aquí
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: "600px", mx: "auto", color: muiTheme.palette.text.secondary, mb: 4 }}>
                Con herramientas modernas y un diseño intuitivo, optimiza la gestión de tus propiedades hoy mismo.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PaginaPrincipalPropietario;
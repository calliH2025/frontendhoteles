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
} from "@mui/material";
import { Hotel, Group, BarChart, ArrowForward } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4f46e5", // Indigo
    },
    secondary: {
      main: "#10b981", // Emerald
    },
    background: {
      default: "#f9fafb", // Light gray
      paper: "#ffffff", // White
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.75rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    body1: {
      fontSize: "1rem",
    },
  },
});

const PaginaPrincipalAdministrativa = () => {
  const navigate = useNavigate();

  const handleNavigation = (title) => {
    if (title === "Administrar Alojamientos") {
      navigate("/admin/gestionhoteles");
    } else if (title === "Gestionar Usuarios") {
      navigate("/admin/gestionusuarios");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", color: "text.primary", py: { xs: 3, sm: 5, md: 6 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: "center", mb: { xs: 3, md: 6 } }}>
              <Typography variant="h1" gutterBottom sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "2.75rem" } }}>
                Panel Administrativo
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}>
                Gestiona alojamientos, usuarios y reportes desde un solo lugar.
              </Typography>
            </Box>
          </Fade>

          <Slide in timeout={1000} direction="up">
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {[
                "Administrar Alojamientos",
                "Gestionar Usuarios",
                "Ver Reportes",
              ].map((title, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    elevation={3}
                    sx={{
                      textAlign: "center",
                      py: { xs: 3, sm: 4 },
                      px: { xs: 1, sm: 2 },
                      borderRadius: "18px",
                      boxShadow: {
                        xs: "0 2px 8px rgba(79,70,229,0.08)",
                        md: "0 4px 20px rgba(16,185,129,0.10)"
                      },
                      minHeight: { xs: 220, sm: 260 },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "all 0.3s",
                      '&:hover': {
                        boxShadow: "0 8px 32px rgba(16,185,129,0.15)",
                        transform: "translateY(-4px) scale(1.03)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ mb: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {index === 0 && <Hotel color="primary" sx={{ fontSize: { xs: 36, sm: 44 } }} />}
                        {index === 1 && <Group color="primary" sx={{ fontSize: { xs: 36, sm: 44 } }} />}
                        {index === 2 && <BarChart color="secondary" sx={{ fontSize: { xs: 36, sm: 44 } }} />}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
                        {title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.95rem", sm: "1rem" }, mb: { xs: 2, sm: 3 } }}>
                        Realiza acciones administrativas de forma sencilla.
                      </Typography>
                      <Button
                        variant="contained"
                        color={index === 2 ? "secondary" : "primary"}
                        endIcon={<ArrowForward />}
                        sx={{ mt: { xs: 1, sm: 3 }, fontSize: { xs: "0.95rem", sm: "1.05rem" }, px: { xs: 2, sm: 4 }, py: { xs: 1, sm: 1.5 } }}
                        onClick={() => handleNavigation(title)}
                        fullWidth
                      >
                        {title}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Slide>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PaginaPrincipalAdministrativa;
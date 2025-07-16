import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Fade,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ConexionExitosa = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/propietario/hoteles"); // Cambia la ruta según tu flujo
    }, 6000); // Redirige automáticamente después de 6 segundos
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        backgroundColor: "#f4fbf6",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Card
            sx={{
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: "1px solid #cce5dc",
              backgroundColor: "white",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: "#2ecc71", mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, fontWeight: "600", color: "#2e7d32" }}>
                ¡Conexión exitosa!
              </Typography>
              <Typography variant="body1" sx={{ color: "#555", mb: 3 }}>
                Tu cuenta ha sido vinculada correctamente con Mercado Pago. Ahora puedes recibir pagos por tus reservas.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/propietario/hoteles")}
                sx={{
                  backgroundColor: "#2ecc71",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#27ae60",
                  },
                }}
              >
                Ir a mis hoteles
              </Button>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default ConexionExitosa;

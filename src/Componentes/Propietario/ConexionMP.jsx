import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Fade,
} from "@mui/material";
import { Security } from "@mui/icons-material";

const ConexionMP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [id_usuario, setIdUsuario] = useState(null);

  const colors = {
    primary: "#4c94bc",
    accent: "#0b7583",
  };

  const styles = {
    container: {
      backgroundColor: "#fafbfc",
      minHeight: "100vh",
      paddingTop: "2rem",
      paddingBottom: "2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      maxWidth: 600,
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #e0e6ed",
      backgroundColor: "white",
    },
    button: {
      backgroundColor: "#009EE3",
      color: "white",
      "&:hover": {
        backgroundColor: "#0066CC",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0, 158, 227, 0.4)",
      },
      "&:disabled": {
        backgroundColor: "#009EE3",
        color: "rgba(255, 255, 255, 0.7)",
        transform: "none",
        boxShadow: "none",
      },
      fontSize: "1rem",
      fontWeight: "600",
      padding: "0.75rem 1.5rem",
      borderRadius: "8px",
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setIdUsuario(decoded.id);
      console.log("ID de usuario decodificado:", decoded.id);
    } catch (error) {
      console.error("Error al decodificar token:", error);
      setError("Token inválido. Por favor, inicia sesión de nuevo.");
    }
  }, []);

  const handleConnect = async () => {
    if (!id_usuario || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://backendreservas-m2zp.onrender.com/api/mercadopago/iniciar-oauth?id_usuario=${id_usuario}`,
        { timeout: 10000 }
      );
      const { oauthUrl } = response.data;
      console.log("URL de OAuth recibida:", oauthUrl);
      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Error en conectar con Mercado Pago:", error.response?.data || error.message);
      setError(
        error.response?.data?.error ||
          "Error al iniciar la conexión con Mercado Pago. Verifica los logs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.container}>
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Card sx={styles.card}>
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Security sx={{ color: colors.primary, fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "600", color: colors.accent, mb: 2 }}>
                Conectar con Mercado Pago
              </Typography>
              <Typography variant="body1" sx={{ color: "#6c757d", mb: 3, lineHeight: 1.5 }}>
                Conecta tu cuenta de Mercado Pago para recibir pagos directamente en tu cuenta.
                Serás redirigido a Mercado Pago para autorizar la conexión de forma segura.
              </Typography>
              {error && (
                <Alert
                  severity="error"
                  onClose={() => setError("")}
                  sx={{ mb: 2, borderRadius: "12px" }}
                >
                  {error}
                </Alert>
              )}
              <Button
                variant="contained"
                onClick={handleConnect}
                disabled={loading || !id_usuario}
                sx={styles.button}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Conectar con Mercado Pago"
                )}
              </Button>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default ConexionMP;

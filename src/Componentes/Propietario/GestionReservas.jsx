import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Modal,
  Fade,
  Button,
} from "@mui/material";
import moment from "moment-timezone";
import "moment/locale/es";

const GestionReservas = () => {
  const [reservas, setReservas] = useState({ fechasConfirmadas: [], Vencida: [] });
  const [selectedDateReservas, setSelectedDateReservas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      setIsLoading(false);
      return;
    }

    const fetchReservas = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("https://backendreservas-m2zp.onrender.com/api/gestionreservas/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservas(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar las reservas.");
        console.error("Error al obtener reservas:", err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const fetchReservasByDate = async (date) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://backendreservas-m2zp.onrender.com/api/gestionreservas/fecha/${date}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.length > 0) {
        setSelectedDateReservas(response.data);
      } else {
        setSelectedDateReservas([]);
      }
      setSelectedDate(date);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.error || "Error al cargar las reservas por fecha.");
      console.error("Error al obtener reservas por fecha:", err.response?.data || err.message);
      setSelectedDateReservas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    // Parsear como local en la zona de México y mostrar el mes en español
    return moment.tz(dateString, "YYYY-MM-DD", "America/Mexico_City").locale("es").format("DD MMMM");
  };

  const formatDateTime = (dateString) => {
    // Mostrar la hora en formato de 12 horas con AM/PM
    return moment.tz(dateString, 'America/Mexico_City').format('DD/MM/YYYY hh:mm A');
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: "1000px" },
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: "80vh",
    overflowY: "auto",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: { xs: "1rem", md: "2rem" },
        background: "linear-gradient(135deg,rgb(255, 255, 255) 0%, #f5f7fa 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ color: "#1976d2", fontWeight: 700, mb: 4, textTransform: "uppercase" }}
        >
          Gestión de Reservas
        </Typography>
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#1976d2" }} />
            <Typography variant="body2" sx={{ color: "#1976d2", mt: 2 }}>
              Cargando reservas...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            {/* Calendario de Reservas Confirmadas */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{ color: "#2e7d32", mb: 2, fontWeight: 600 }}
              >
                Fechas de Reservas Confirmadas
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {reservas.fechasConfirmadas.map((date) => (
                  <Card
                    key={date}
                    sx={{
                      width: { xs: "100%", sm: "calc(33.33% - 16px)" },
                      cursor: "pointer",
                      backgroundColor: "#e8f5e9",
                      "&:hover": { backgroundColor: "#c8e6c9" },
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => fetchReservasByDate(date)}
                  >
                    <CardContent sx={{ textAlign: "center", p: 2 }}>
                      <Typography variant="h6" sx={{ color: "#2e7d32" }}>
                        {formatDate(date)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              {reservas.fechasConfirmadas.length === 0 && (
                <Typography variant="body1" align="center" sx={{ color: "#666", mt: 2 }}>
                  No hay fechas de reservas confirmadas.
                </Typography>
              )}
            </Box>

            {/* Tabla de Reservas Vencidas */}
            {reservas.Vencida.length > 0 && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: "#d32f2f", mb: 2, fontWeight: 600 }}
                >
                  Reservas Vencidas
                </Typography>
                <Paper sx={{ borderRadius: 2, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#ffebee" }}>
                        <TableCell sx={{ fontWeight: 600, color: "#d32f2f" }}>Cliente</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#d32f2f" }}>Habitación</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#d32f2f" }}>Entrada</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#d32f2f" }}>Salida</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#d32f2f" }}>Total</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#d32f2f" }}>Hotel</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reservas.Vencida.sort((a, b) => new Date(b.fechafin) - new Date(a.fechafin)).map((res) => (
                        <TableRow key={res.id_reserva}>
                          <TableCell>{`${res.nombre_cliente} ${res.apellido_paterno}`}</TableCell>
                          <TableCell>{res.cuarto}</TableCell>
                          <TableCell>{formatDateTime(res.fechainicio)}</TableCell>
                          <TableCell>{formatDateTime(res.fechafin)}</TableCell>
                          <TableCell>${res.totalpagar}</TableCell>
                          <TableCell>{res.nombrehotel}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            )}

            {reservas.Vencida.length === 0 && reservas.fechasConfirmadas.length === 0 && (
              <Typography variant="body1" align="center" sx={{ color: "#666", mt: 4 }}>
                No hay reservas para mostrar en este momento.
              </Typography>
            )}
          </>
        )}

        {/* Modal para Reservas Confirmadas de la Fecha Seleccionada */}
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} closeAfterTransition>
          <Fade in={isModalOpen}>
            <Box sx={modalStyle}>
              <Typography variant="h6" sx={{ color: "#2e7d32", mb: 2, textAlign: "center" }}>
                Reservas Confirmadas para {selectedDate ? moment.utc(selectedDate).tz("America/Mexico_City").format("DD MMMM YYYY") : ""}
              </Typography>
              {isLoading ? (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <CircularProgress sx={{ color: "#2e7d32" }} />
                </Box>
              ) : error ? (
                <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              ) : selectedDateReservas.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ color: "#666" }}>
                  No hay reservas confirmadas para esta fecha.
                </Typography>
              ) : (
                <Paper sx={{ borderRadius: 2, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
                        <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>Cliente</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>Habitación</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>Entrada</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>Salida</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>Total</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#2e7d32" }}>Hotel</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedDateReservas.map((res) => (
                        <TableRow key={res.id_reserva}>
                          <TableCell>{`${res.nombre_cliente} ${res.apellido_paterno}`}</TableCell>
                          <TableCell>{res.cuarto}</TableCell>
                          <TableCell>{formatDateTime(res.fechainicio)}</TableCell>
                          <TableCell>{formatDateTime(res.fechafin)}</TableCell>
                          <TableCell>${res.totalpagar}</TableCell>
                          <TableCell>{res.nombrehotel}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="contained"
                  sx={{ backgroundColor: "#d32f2f", color: "white", "&:hover": { backgroundColor: "#b71c1c" } }}
                >
                  Cerrar
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
};

export default GestionReservas;
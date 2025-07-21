import { useState, useEffect } from "react";
import axios from "axios";
import momentTz from "moment-timezone"; // Asegúrate de instalar moment-timezone: npm install moment-timezone
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Hotel as HotelIcon } from "@mui/icons-material";
import Swal from "sweetalert2";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reservas-tabpanel-${index}`}
      aria-labelledby={`reservas-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MisReservas() {
  const [tabValue, setTabValue] = useState(0);
  const [confirmedReservations, setConfirmedReservations] = useState([]);
  const [expiredReservations, setExpiredReservations] = useState([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [id_usuario, setIdUsuario] = useState(null);
  const [error, setError] = useState(null);
  const [reservationSuccess, setReservationSuccess] = useState(null);

  const colors = {
    primary: "#4c94bc",
    success: "#549c94",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      setIsLoadingReservations(false);
      return;
    }

    const setupAxiosInterceptors = () => {
      axios.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        (error) => Promise.reject(error)
      );

      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            setError("Sesión expirada. Por favor, inicia sesión de nuevo.");
            localStorage.removeItem("token");
            localStorage.removeItem("id_usuario");
            localStorage.removeItem("cancelledReservations");
          }
          return Promise.reject(error);
        }
      );
    };

    setupAxiosInterceptors();

    const decodeToken = () => {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setIdUsuario(decoded.id);
      } catch (error) {
        console.error("Error al decodificar token:", error);
        setError("Token inválido. Por favor, inicia sesión de nuevo.");
        setIsLoadingReservations(false);
      }
    };

    if (!id_usuario) {
      decodeToken();
    }

    if (id_usuario) {
      fetchUserReservations();
    }
  }, [id_usuario]);

  const fetchUserReservations = async () => {
    try {
      setIsLoadingReservations(true);
      if (!id_usuario) return;

      const [confirmedResponse, expiredResponse] = await Promise.all([
        axios.get(`https://backendreservas-m2zp.onrender.com/api/reservas/usuario/${id_usuario}/confirmed`),
        axios.get(`https://backendreservas-m2zp.onrender.com/api/reservas/usuario/${id_usuario}/expired`),
      ]);

      console.log("Reservas Confirmadas Crudas:", confirmedResponse.data);
      console.log("Reservas Vencidas Crudas:", expiredResponse.data);

      // Usamos las fechas directamente, asumiendo que ya están en CST
      const formattedConfirmed = confirmedResponse.data.map(reserva => ({
        ...reserva,
        fechainicio: reserva.fechainicio, // Directamente usamos el valor recibido
        fechafin: reserva.fechafin       // Directamente usamos el valor recibido
      }));

      const formattedExpired = expiredResponse.data.map(reserva => ({
        ...reserva,
        fechainicio: reserva.fechainicio, // Directamente usamos el valor recibido
        fechafin: reserva.fechafin       // Directamente usamos el valor recibido
      }));

      const cancelledReservations = JSON.parse(localStorage.getItem("cancelledReservations") || "[]");
      const filteredConfirmed = formattedConfirmed.filter(
        (res) => !cancelledReservations.includes(res.id_reserva) && res.fechainicio && res.fechafin
      );
      const filteredExpired = formattedExpired.filter(
        (res) => !cancelledReservations.includes(res.id_reserva) && res.fechainicio && res.fechafin
      );

      setConfirmedReservations(filteredConfirmed);
      setExpiredReservations(filteredExpired);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Error al cargar las reservas del usuario.");
      console.error("Error al obtener reservas:", err.response?.data || err.message);
    } finally {
      setIsLoadingReservations(false);
    }
  };

  const handleCancelReservation = async (id_reserva) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción cancelará tu reserva!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`https://backendreservas-m2zp.onrender.com/api/reservas/${id_reserva}/cancelar`);
        if (response.status === 200 && response.data.confirmCancel) {
          setConfirmedReservations((prev) => prev.filter((res) => res.id_reserva !== id_reserva));
          setReservationSuccess("Reserva cancelada exitosamente en el sistema.");
          setError(null);
        } else {
          throw new Error("La cancelación no se confirmó correctamente en el servidor.");
        }
      } catch (err) {
        setError("Error al cancelar la reserva. Por favor, intenta de nuevo o contacta al administrador.");
        console.error("Error al cancelar reserva:", err.message);
      }
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) {
      console.warn('Fecha recibida es nula o indefinida:', fecha);
      return 'Fecha no disponible';
    }
    const fechaMoment = momentTz(fecha, 'YYYY-MM-DD HH:mm:ss'); // No usamos .tz() ya que asumimos CST
    if (!fechaMoment.isValid()) {
      console.warn('Fecha inválida recibida:', fecha);
      return 'Fecha inválida';
    }
    console.log('Fecha procesada:', fecha, '->', fechaMoment.format('YYYY-MM-DD HH:mm:ss'));
    return fechaMoment.format('D [de] MMMM [de] YYYY, h:mm a');
  };

  const TablaReservas = ({ reservas, mostrarAcciones = false }) => (
    <TableContainer component={Paper} elevation={2}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla de reservas">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Hotel</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Habitación</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Fecha de Entrada</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Fecha de Salida</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
            {mostrarAcciones && <TableCell sx={{ fontWeight: "bold" }}>Acción</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {reservas.map((reserva) => (
            <TableRow key={reserva.id_reserva} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <HotelIcon color="primary" />
                  {reserva.nombrehotel || "No especificado"}
                </Box>
              </TableCell>
              <TableCell>{reserva.cuarto || "No especificado"}</TableCell>
              <TableCell>{formatearFecha(reserva.fechainicio)}</TableCell>
              <TableCell>{formatearFecha(reserva.fechafin)}</TableCell>
              <TableCell>
                <Chip label={`$${reserva.totalpagar}`} color="success" variant="outlined" sx={{ fontWeight: "bold" }} />
              </TableCell>
              {mostrarAcciones && (
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleCancelReservation(reserva.id_reserva)}
                  >
                    Cancelar
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto", p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <HotelIcon fontSize="large" color="primary" />
            Mis Reservas de Hotel
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona tus reservas confirmadas y revisa tu historial de reservas vencidas
          </Typography>
        </CardContent>
      </Card>

      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ borderRadius: "12px", fontSize: "1.1rem", mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {reservationSuccess && (
        <Alert
          severity="success"
          onClose={() => setReservationSuccess(null)}
          sx={{ borderRadius: "12px", fontSize: "1.1rem", mb: 2 }}
        >
          {reservationSuccess}
        </Alert>
      )}

      <Paper sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)} aria-label="tabs de reservas">
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  Reservas Confirmadas
                  <Chip size="small" label={confirmedReservations.length} color="success" />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  Reservas Vencidas
                  <Chip size="small" label={expiredReservations.length} color="default" />
                </Box>
              }
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom color="success.main">
            Reservas Confirmadas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Estas son tus reservas activas. Puedes cancelar si es necesario.
          </Typography>
          {isLoadingReservations ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress size={30} sx={{ color: colors.primary }} />
              <Typography variant="body1" sx={{ color: colors.primary, mt: 2 }}>
                Cargando reservas...
              </Typography>
            </Box>
          ) : confirmedReservations.length > 0 ? (
            <TablaReservas reservas={confirmedReservations} mostrarAcciones={true} />
          ) : (
            <Typography variant="body1" color="text.secondary">
              No hay reservas confirmadas.
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Reservas Vencidas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Historial de tus reservas pasadas.
          </Typography>
          {isLoadingReservations ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress size={30} sx={{ color: colors.primary }} />
              <Typography variant="body1" sx={{ color: colors.primary, mt: 2 }}>
                Cargando reservas...
              </Typography>
            </Box>
          ) : expiredReservations.length > 0 ? (
            <TablaReservas reservas={expiredReservations} mostrarAcciones={false} />
          ) : (
            <Typography variant="body1" color="text.secondary">
              No hay reservas vencidas.
            </Typography>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
}
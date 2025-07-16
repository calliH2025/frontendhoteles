import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Toolbar,
  Stack,
  Alert,
  Container,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
} from "@mui/material"
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Hotel as HotelIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material"

const estadosReserva = [
  { value: "todas", label: "Todas", color: "default" },
  { value: "confirmado", label: "Confirmado", color: "success" },
  { value: "vencida", label: "Vencida", color: "error" },
  { value: "cancelado", label: "Cancelado", color: "warning" },
]

export default function GestionReservas() {
  const [reservas, setReservas] = useState([])
  const [hoteles, setHoteles] = useState(["Todos"])
  const [filtros, setFiltros] = useState({
    estado: "todas",
    hotel: "Todos",
    cliente: "",
    fechaDesde: "",
    fechaHasta: "",
  })
  const [dialogoEliminacion, setDialogoEliminacion] = useState({
    abierto: false,
    reservaId: null,
    clienteNombre: "",
  })
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })
  const [expandedSections, setExpandedSections] = useState({
    confirmado: true,
    vencida: true,
    cancelado: true,
  })

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch('https://backendreservas-m2zp.onrender.com/api/gestionreservasadmin/list')
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        console.log('Reservas recibidas:', data); // Depuración
        setReservas(data)
        setMensaje({ tipo: "success", texto: "Reservas cargadas exitosamente" })
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 4000)
      } catch (error) {
        setMensaje({ tipo: "error", texto: `Error al cargar reservas: ${error.message}` })
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 4000)
      }
    }

    const fetchHoteles = async () => {
      try {
        const response = await fetch('https://backendreservas-m2zp.onrender.com/api/gestionreservasadmin/hotels')
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        setHoteles(["Todos", ...data.map(hotel => hotel.nombrehotel)])
      } catch (error) {
        setMensaje({ tipo: "error", texto: `Error al cargar hoteles: ${error.message}` })
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 4000)
      }
    }

    fetchReservas()
    fetchHoteles()
  }, [])

  const reservasConEstadoReal = useMemo(() => {
    return reservas.map((reserva) => ({
      ...reserva,
      estadoReal: reserva.estado,
    }))
  }, [reservas])

  const reservasFiltradas = useMemo(() => {
    return reservasConEstadoReal.filter((reserva) => {
      if (filtros.estado !== "todas" && reserva.estadoReal !== filtros.estado) {
        return false
      }
      if (filtros.hotel !== "Todos" && reserva.hotel !== filtros.hotel) {
        return false
      }
      if (filtros.cliente && !reserva.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())) {
        return false
      }
      if (filtros.fechaDesde && new Date(reserva.fechaEntrada) < new Date(filtros.fechaDesde)) {
        return false
      }
      if (filtros.fechaHasta && new Date(reserva.fechaEntrada) > new Date(filtros.fechaHasta)) {
        return false
      }
      return true
    })
  }, [reservasConEstadoReal, filtros])

  const reservasPorEstado = useMemo(() => {
    return {
      confirmado: reservasFiltradas.filter((r) => r.estadoReal === "confirmado"),
      vencida: reservasFiltradas.filter((r) => r.estadoReal === "vencida"),
      cancelado: reservasFiltradas.filter((r) => r.estadoReal === "cancelado"),
    }
  }, [reservasFiltradas])

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      estado: "todas",
      hotel: "Todos",
      cliente: "",
      fechaDesde: "",
      fechaHasta: "",
    })
  }

  const handleExpandSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const abrirDialogoEliminacion = (reservaId, clienteNombre) => {
    setDialogoEliminacion({
      abierto: true,
      reservaId,
      clienteNombre,
    })
  }

  const cerrarDialogoEliminacion = () => {
    setDialogoEliminacion({
      abierto: false,
      reservaId: null,
      clienteNombre: "",
    })
  }

  const confirmarEliminacion = async () => {
    try {
      const response = await fetch(`https://backendreservas-m2zp.onrender.com/api/gestionreservasadmin/${dialogoEliminacion.reservaId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setReservas((prev) => prev.filter((reserva) => reserva.id !== dialogoEliminacion.reservaId))
      setMensaje({
        tipo: "success",
        texto: `Reserva ${dialogoEliminacion.reservaId} de ${dialogoEliminacion.clienteNombre} eliminada exitosamente`,
      })
    } catch (error) {
      setMensaje({ tipo: "error", texto: `Error al eliminar la reserva: ${error.message}` })
    } finally {
      cerrarDialogoEliminacion()
      setTimeout(() => setMensaje({ tipo: "", texto: "" }), 4000)
    }
  }

  const getChipColor = (estado) => {
    const estadoConfig = estadosReserva.find((e) => e.value === estado)
    return estadoConfig ? estadoConfig.color : "default"
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad)
  }

  const renderTablaReservas = (reservas, titulo, icono, color) => {
    if (reservas.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="body2">No hay reservas {titulo.toLowerCase()}</Typography>
        </Box>
      )
    }

    return (
      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", bgcolor: `${color}.50` }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: "bold", bgcolor: `${color}.50` }}>Hotel</TableCell>
              <TableCell sx={{ fontWeight: "bold", bgcolor: `${color}.50` }}>Fecha Entrada</TableCell>
              <TableCell sx={{ fontWeight: "bold", bgcolor: `${color}.50` }}>Fecha Salida</TableCell>
              <TableCell sx={{ fontWeight: "bold", bgcolor: `${color}.50` }} align="center">
                Habitaciones
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", bgcolor: `${color}.50` }} align="right">
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", bgcolor: `${color}.50` }} align="center">
                Acción
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservas.map((reserva, index) => (
              <TableRow
                key={reserva.id}
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                  bgcolor: index % 2 === 0 ? "grey.25" : "white",
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonIcon sx={{ mr: 1, color: "action.active", fontSize: 16 }} />
                    <Typography variant="body2" fontWeight="medium">
                      {reserva.cliente || 'Cliente desconocido'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <HotelIcon sx={{ mr: 1, color: "action.active", fontSize: 16 }} />
                    <Typography variant="body2">{reserva.hotel || 'Hotel desconocido'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatearFecha(reserva.fechaEntrada)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatearFecha(reserva.fechaSalida)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {reserva.habitaciones}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    {formatearMoneda(reserva.total)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => abrirDialogoEliminacion(reserva.id, reserva.cliente || 'Cliente desconocido')}
                    title="Eliminar reserva"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "normal", color: "black" }}>
          <HotelIcon sx={{ mr: 2, fontSize: "inherit", verticalAlign: "middle" }} />
          Gestión de Reservas
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Administra y controla todas las reservas del sistema
        </Typography>
      </Box>

      {mensaje.texto && (
        <Alert severity={mensaje.tipo} sx={{ mb: 3 }} onClose={() => setMensaje({ tipo: "", texto: "" })}>
          {mensaje.texto}
        </Alert>
      )}

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Toolbar sx={{ pl: 0, pr: 0, minHeight: "48px !important" }}>
            <FilterIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "medium" }}>
              Filtros de Búsqueda
            </Typography>
            <Button startIcon={<ClearIcon />} onClick={limpiarFiltros} size="small" variant="outlined">
              Limpiar Filtros
            </Button>
          </Toolbar>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filtros.estado}
                  label="Estado"
                  onChange={(e) => handleFiltroChange("estado", e.target.value)}
                >
                  {estadosReserva.map((estado) => (
                    <MenuItem key={estado.value} value={estado.value}>
                      <Chip label={estado.label} color={estado.color} size="small" sx={{ minWidth: 80 }} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel>Hotel</InputLabel>
                <Select
                  value={filtros.hotel}
                  label="Hotel"
                  onChange={(e) => handleFiltroChange("hotel", e.target.value)}
                >
                  {hoteles.map((hotel) => (
                    <MenuItem key={hotel} value={hotel}>
                      {hotel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                size="small"
                label="Buscar Cliente"
                value={filtros.cliente}
                onChange={(e) => handleFiltroChange("cliente", e.target.value)}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: "action.active" }} />,
                }}
                placeholder="Nombre del cliente..."
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                size="small"
                label="Fecha Desde"
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => handleFiltroChange("fechaDesde", e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: "action.active" }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                size="small"
                label="Fecha Hasta"
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => handleFiltroChange("fechaHasta", e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: "action.active" }} />,
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", boxShadow: 2, bgcolor: "primary.50" }}>
            <CardContent>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: "bold" }}>
                {reservasFiltradas.length}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: "medium" }}>
                Total Reservas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", boxShadow: 2, bgcolor: "success.50" }}>
            <CardContent>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: "bold" }}>
                {reservasPorEstado.confirmado.length}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: "medium" }}>
                Confirmados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", boxShadow: 2, bgcolor: "error.50" }}>
            <CardContent>
              <Typography variant="h3" color="error.main" sx={{ fontWeight: "bold" }}>
                {reservasPorEstado.vencida.length}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: "medium" }}>
                Vencidas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", boxShadow: 2, bgcolor: "warning.50" }}>
            <CardContent>
              <Typography variant="h3" color="warning.main" sx={{ fontWeight: "bold" }}>
                {reservasPorEstado.cancelado.length}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: "medium" }}>
                Cancelados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack spacing={3}>
        <Card sx={{ boxShadow: 3 }}>
          <Accordion expanded={expandedSections.confirmado} onChange={() => handleExpandSection("confirmado")}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "success.50" }}>
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <CheckCircleIcon sx={{ mr: 2, color: "success.main" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "success.main", flexGrow: 1 }}>
                  Reservas Confirmados
                </Typography>
                <Badge badgeContent={reservasPorEstado.confirmado.length} color="success" sx={{ mr: 2 }} />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {renderTablaReservas(reservasPorEstado.confirmado, "Confirmados", CheckCircleIcon, "success")}
            </AccordionDetails>
          </Accordion>
        </Card>

        <Card sx={{ boxShadow: 3 }}>
          <Accordion expanded={expandedSections.vencida} onChange={() => handleExpandSection("vencida")}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "error.50" }}>
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <ScheduleIcon sx={{ mr: 2, color: "error.main" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "error.main", flexGrow: 1 }}>
                  Reservas Vencidas
                </Typography>
                <Badge badgeContent={reservasPorEstado.vencida.length} color="error" sx={{ mr: 2 }} />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {renderTablaReservas(reservasPorEstado.vencida, "Vencidas", ScheduleIcon, "error")}
            </AccordionDetails>
          </Accordion>
        </Card>

        <Card sx={{ boxShadow: 3 }}>
          <Accordion expanded={expandedSections.cancelado} onChange={() => handleExpandSection("cancelado")}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "warning.50" }}>
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <ErrorIcon sx={{ mr: 2, color: "warning.main" }} />
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "warning.main", flexGrow: 1 }}>
                  Reservas Cancelados
                </Typography>
                <Badge badgeContent={reservasPorEstado.cancelado.length} color="warning" sx={{ mr: 2 }} />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {renderTablaReservas(reservasPorEstado.cancelado, "Cancelados", ErrorIcon, "warning")}
            </AccordionDetails>
          </Accordion>
        </Card>
      </Stack>

      {reservasFiltradas.length === 0 && (
        <Card sx={{ mt: 4, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ p: 6, textAlign: "center" }}>
              <HotelIcon sx={{ fontSize: 64, color: "action.disabled", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No se encontraron reservas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No hay reservas que coincidan con los filtros aplicados
              </Typography>
              <Button variant="outlined" onClick={limpiarFiltros} sx={{ mt: 2 }} startIcon={<ClearIcon />}>
                Limpiar Filtros
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogoEliminacion.abierto} onClose={cerrarDialogoEliminacion} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "error.50", color: "error.main" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Confirmar Eliminación de Reserva
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText component="div">
            <Typography variant="body1" gutterBottom>
              ¿Está seguro de que desea eliminar permanentemente la siguiente reserva?
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>ID de Reserva:</strong> {dialogoEliminacion.reservaId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Cliente:</strong> {dialogoEliminacion.clienteNombre}
              </Typography>
            </Box>
            <Alert severity="error" sx={{ mt: 2 }}>
              <strong>¡ATENCIÓN!</strong> Esta acción no se puede deshacer. La reserva será eliminada permanentemente
              del sistema.
            </Alert>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={cerrarDialogoEliminacion} variant="outlined">
            No, Mantener Reserva
          </Button>
          <Button onClick={confirmarEliminacion} color="error" variant="contained" startIcon={<DeleteIcon />}>
            Sí, Eliminar Permanentemente
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
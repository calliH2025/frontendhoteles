import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Grid,
  Alert,
  Snackbar,
  Tooltip,
  Avatar,
  Stack,
} from "@mui/material"
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  Campaign as CampaignIcon,
  Store as StoreIcon,
} from "@mui/icons-material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const GestionPromociones = () => {
  const [tabValue, setTabValue] = useState(0)
  const [promociones, setPromociones] = useState([
    {
      id: 1,
      titulo: "Descuento Verano 2024",
      descripcion: "50% de descuento en hospedajes de playa",
      tipo: "global",
      descuento: 50,
      fechaInicio: "2024-06-01",
      fechaFin: "2024-08-31",
      estado: "activo",
      propietario: "Admin",
      propiedadesAplicadas: 25,
      usos: 150,
    },
    {
      id: 2,
      titulo: "Promoción Casa del Mar",
      descripcion: "Estancia mínima 3 noches con desayuno incluido",
      tipo: "propietario",
      descuento: 30,
      fechaInicio: "2024-07-01",
      fechaFin: "2024-09-30",
      estado: "pendiente",
      propietario: "Juan Pérez",
      propiedadesAplicadas: 1,
      usos: 8,
    },
    {
      id: 3,
      titulo: "Oferta Fin de Semana",
      descripcion: "Descuento especial para reservas de fin de semana",
      tipo: "global",
      descuento: 25,
      fechaInicio: "2024-07-15",
      fechaFin: "2024-12-31",
      estado: "activo",
      propietario: "Admin",
      propiedadesAplicadas: 40,
      usos: 89,
    },
    {
      id: 4,
      titulo: "Villa Sunset Especial",
      descripcion: "Promoción exclusiva para Villa Sunset",
      tipo: "propietario",
      descuento: 40,
      fechaInicio: "2024-08-01",
      fechaFin: "2024-10-31",
      estado: "inactivo",
      propietario: "María González",
      propiedadesAplicadas: 1,
      usos: 0,
    },
  ])

  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState("create")
  const [selectedPromocion, setSelectedPromocion] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    descuento: "",
    fechaInicio: "",
    fechaFin: "",
    tipo: "global",
  })

  // Datos para gráficos
  const estadisticasData = [
    { name: "Activas", value: promociones.filter((p) => p.estado === "activo").length, color: "#4caf50" },
    { name: "Pendientes", value: promociones.filter((p) => p.estado === "pendiente").length, color: "#ff9800" },
    { name: "Inactivas", value: promociones.filter((p) => p.estado === "inactivo").length, color: "#f44336" },
  ]

  const usosData = promociones.map((p) => ({
    name: p.titulo.substring(0, 15) + "...",
    usos: p.usos,
    descuento: p.descuento,
  }))

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleOpenDialog = (type, promocion = null) => {
    setDialogType(type)
    setSelectedPromocion(promocion)
    if (promocion) {
      setFormData({
        titulo: promocion.titulo,
        descripcion: promocion.descripcion,
        descuento: promocion.descuento,
        fechaInicio: promocion.fechaInicio,
        fechaFin: promocion.fechaFin,
        tipo: promocion.tipo,
      })
    } else {
      setFormData({
        titulo: "",
        descripcion: "",
        descuento: "",
        fechaInicio: "",
        fechaFin: "",
        tipo: "global",
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedPromocion(null)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    if (dialogType === "create") {
      const newPromocion = {
        id: Date.now(),
        ...formData,
        estado: "activo",
        propietario: "Admin",
        propiedadesAplicadas: formData.tipo === "global" ? Math.floor(Math.random() * 50) + 10 : 1,
        usos: 0,
      }
      setPromociones((prev) => [...prev, newPromocion])
      setSnackbar({ open: true, message: "Promoción creada exitosamente", severity: "success" })
    } else if (dialogType === "edit") {
      setPromociones((prev) => prev.map((p) => (p.id === selectedPromocion.id ? { ...p, ...formData } : p)))
      setSnackbar({ open: true, message: "Promoción actualizada exitosamente", severity: "success" })
    }
    handleCloseDialog()
  }

  const handleDelete = (id) => {
    setPromociones((prev) => prev.filter((p) => p.id !== id))
    setSnackbar({ open: true, message: "Promoción eliminada exitosamente", severity: "success" })
  }

  const handleApprove = (id) => {
    setPromociones((prev) => prev.map((p) => (p.id === id ? { ...p, estado: "activo" } : p)))
    setSnackbar({ open: true, message: "Promoción aprobada exitosamente", severity: "success" })
  }

  const handleReject = (id) => {
    setPromociones((prev) => prev.map((p) => (p.id === id ? { ...p, estado: "inactivo" } : p)))
    setSnackbar({ open: true, message: "Promoción rechazada", severity: "info" })
  }

  const getStatusColor = (estado) => {
    switch (estado) {
      case "activo":
        return "success"
      case "pendiente":
        return "warning"
      case "inactivo":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusText = (estado) => {
    switch (estado) {
      case "activo":
        return "Activo"
      case "pendiente":
        return "Pendiente"
      case "inactivo":
        return "Inactivo"
      default:
        return estado
    }
  }

  const filteredPromociones = () => {
    switch (tabValue) {
      case 0:
        return promociones // Todas
      case 1:
        return promociones.filter((p) => p.tipo === "global") // Globales
      case 2:
        return promociones.filter((p) => p.tipo === "propietario") // Propietarios
      case 3:
        return promociones.filter((p) => p.estado === "pendiente") // Pendientes
      default:
        return promociones
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CampaignIcon fontSize="large" color="primary" />
          Gestión de Promociones
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Administra promociones globales y de propietarios
        </Typography>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Uso de Promociones
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={usosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="usos" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado de Promociones
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={estadisticasData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                    {estadisticasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs y Botón Crear */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Todas" />
          <Tab label="Globales" />
          <Tab label="Propietarios" />
          <Tab label="Pendientes" />
        </Tabs>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog("create")} sx={{ ml: 2 }}>
          Nueva Promoción
        </Button>
      </Box>

      {/* Tabla de Promociones */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Promoción</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descuento</TableCell>
                <TableCell>Vigencia</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Propietario</TableCell>
                <TableCell>Usos</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPromociones().map((promocion) => (
                <TableRow key={promocion.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {promocion.titulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {promocion.descripcion}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={promocion.tipo === "global" ? <TrendingUpIcon /> : <StoreIcon />}
                      label={promocion.tipo === "global" ? "Global" : "Propietario"}
                      variant="outlined"
                      color={promocion.tipo === "global" ? "primary" : "secondary"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" color="primary">
                      {promocion.descuento}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(promocion.fechaInicio).toLocaleDateString()} -{" "}
                      {new Date(promocion.fechaFin).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(promocion.estado)}
                      color={getStatusColor(promocion.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                        {promocion.propietario.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{promocion.propietario}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{promocion.usos} usos</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {promocion.propiedadesAplicadas} propiedades
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1}>
                      {promocion.estado === "pendiente" && (
                        <>
                          <Tooltip title="Aprobar">
                            <IconButton size="small" color="success" onClick={() => handleApprove(promocion.id)}>
                              <CheckIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Rechazar">
                            <IconButton size="small" color="error" onClick={() => handleReject(promocion.id)}>
                              <CloseIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="Editar">
                        <IconButton size="small" color="primary" onClick={() => handleOpenDialog("edit", promocion)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => handleDelete(promocion.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dialog para Crear/Editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogType === "create" ? "Nueva Promoción" : "Editar Promoción"}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título de la Promoción"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Promoción</InputLabel>
                  <Select
                    value={formData.tipo}
                    label="Tipo de Promoción"
                    onChange={(e) => handleInputChange("tipo", e.target.value)}
                  >
                    <MenuItem value="global">Global</MenuItem>
                    <MenuItem value="propietario">Propietario</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Descuento (%)"
                  value={formData.descuento}
                  onChange={(e) => handleInputChange("descuento", e.target.value)}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Inicio"
                  value={formData.fechaInicio}
                  onChange={(e) => handleInputChange("fechaInicio", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Fin"
                  value={formData.fechaFin}
                  onChange={(e) => handleInputChange("fechaFin", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogType === "create" ? "Crear" : "Actualizar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default GestionPromociones;

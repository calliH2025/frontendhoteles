import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  InputAdornment,
  Tooltip,
  IconButton,
  Skeleton,
  Alert,
  Fade,
} from "@mui/material";
import {
  Search as SearchIcon,
  PersonOff as PersonOffIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccountCircle as AccountCircleIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

export default function GestionUsuarios() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetching, setIsFetching] = useState(true); // Renamed for clarity
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [showPasswords, setShowPasswords] = useState({});
  const [actionLoading, setActionLoading] = useState({}); // For button-specific loading

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setIsFetching(true);
    try {
      const [clientesResp, propietariosResp] = await Promise.all([
        fetch("https://backendreservas-m2zp.onrender.com/api/gestionusuarios/list/Cliente").then((res) => res.json()),
        fetch("https://backendreservas-m2zp.onrender.com/api/gestionusuarios/list/Propietario").then((res) => res.json()),
      ]);
      const mappedClientes = clientesResp.map((user) => ({
        id: user.id,
        name: `${user.Nombre} ${user.ApellidoP} ${user.ApellidoM || ""}`.trim(),
        email: user.Correo,
        phone: user.Telefono,
        username: user.Usuario,
        password: user.Password,
        status: user.is_verified ? "active" : "inactive",
        role: "Cliente",
        tipo: "Cliente",
      }));
      const mappedPropietarios = propietariosResp.map((user) => ({
        id: user.id,
        name: `${user.Nombre} ${user.ApellidoP} ${user.ApellidoM || ""}`.trim(),
        email: user.Correo,
        phone: user.Telefono,
        username: user.Usuario,
        password: user.Password,
        status: user.is_verified ? "active" : "inactive",
        role: "Propietario",
        tipo: "Propietario",
      }));
      setUsers([...mappedClientes, ...mappedPropietarios]);
      setError("");
    } catch (err) {
      setError("Error al cargar usuarios");
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactivo" : "activo";
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      const response = await fetch(`https://backendreservas-m2zp.onrender.com/api/gestionusuarios/toggle/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, status: newStatus === "activo" ? "active" : "inactive" }
            : user,
        ),
      );
      setSuccess(`Usuario ${userId} ${newStatus} exitosamente`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error al actualizar estado del usuario");
      console.error(err);
      setTimeout(() => setError(""), 3000);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const deleteUser = async (userId) => {
    setActionLoading((prev) => ({ ...prev, [`delete_${userId}`]: true }));
    try {
      await fetch(`https://backendreservas-m2zp.onrender.com/api/gestionusuarios/delete/${userId}`, { method: "DELETE" });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setSuccess(`Usuario ${userId} eliminado exitosamente`);
      setTimeout(() => setSuccess(""), 3000);
      setDeleteDialog({ open: false, user: null });
    } catch (err) {
      setError("Error al eliminar usuario");
      console.error(err);
      setTimeout(() => setError(""), 3000);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`delete_${userId}`]: false }));
    }
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusChip = (status) => {
    return status === "active" ? (
      <Chip label="Activo" color="success" size="small" />
    ) : (
      <Chip label="Inactivo" color="error" size="small" />
    );
  };

  const getRoleChip = (role) => {
    const colors = {
      Cliente: "primary",
      Propietario: "secondary",
      Admin: "primary",
      Moderador: "secondary",
      Usuario: "default",
    };
    return <Chip label={role} color={colors[role] || "default"} variant="outlined" size="small" />;
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderTable = () => {
    if (isFetching) {
      return (
        <Card>
          <CardContent>
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
            ))}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Credenciales</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: user.tipo === "Cliente" ? "primary.main" : "secondary.main" }}>
                        {getInitials(user.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {user.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                        <EmailIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {user.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                        <AccountCircleIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {user.username}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {showPasswords[user.id] ? user.password : "••••••••"}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => togglePasswordVisibility(user.id)}
                        >
                          {showPasswords[user.id] ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{getStatusChip(user.status)}</TableCell>
                  <TableCell>{getRoleChip(user.role)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                      <Tooltip title={user.status === "active" ? "Desactivar usuario" : "Activar usuario"}>
                        <Button
                          variant={user.status === "active" ? "outlined" : "contained"}
                          color={user.status === "active" ? "warning" : "success"}
                          size="small"
                          onClick={() => toggleUserStatus(user.id, user.status)}
                          disabled={actionLoading[user.id]}
                          startIcon={user.status === "active" ? <PersonOffIcon /> : <PersonAddIcon />}
                        >
                          {actionLoading[user.id] ? "Procesando..." : user.status === "active" ? "Desactivar" : "Activar"}
                        </Button>
                      </Tooltip>
                      <Tooltip title="Eliminar usuario">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => setDeleteDialog({ open: true, user })}
                          disabled={actionLoading[`delete_${user.id}`]}
                          startIcon={<DeleteIcon />}
                        >
                          {actionLoading[`delete_${user.id}`] ? "Eliminando..." : "Eliminar"}
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredUsers.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <PersonOffIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No se encontraron usuarios que coincidan con la búsqueda.
            </Typography>
          </Box>
        )}
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <PersonIcon />
          Gestión de Usuarios
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra las cuentas de usuario, desactiva o elimina usuarios según sea necesario.
        </Typography>
      </Box>

      {/* Barra de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar usuarios por nombre, email o usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Usuarios
                  </Typography>
                  <Typography variant="h4">{users.length}</Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Usuarios Activos
                  </Typography>
                  <Typography variant="h4" sx={{ color: "success.main" }}>
                    {users.filter((u) => u.status === "active").length}
                  </Typography>
                </Box>
                <PersonAddIcon sx={{ fontSize: 40, color: "success.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Usuarios Inactivos
                  </Typography>
                  <Typography variant="h4" sx={{ color: "error.main" }}>
                    {users.filter((u) => u.status === "inactive").length}
                  </Typography>
                </Box>
                <PersonOffIcon sx={{ fontSize: 40, color: "error.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de usuarios */}
      {renderTable()}

      {/* Alertas flotantes */}
      <Box sx={{ position: "fixed", top: 24, right: 24, zIndex: 1300, minWidth: 400 }}>
        {error && (
          <Fade in={!!error}>
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ mb: 2, borderRadius: 3, boxShadow: "0 8px 32px rgba(239, 68, 68, 0.3)" }}
            >
              {error}
            </Alert>
          </Fade>
        )}
        {success && (
          <Fade in={!!success}>
            <Alert
              severity="success"
              onClose={() => setSuccess("")}
              sx={{ mb: 2, borderRadius: 3, boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)" }}
            >
              {success}
            </Alert>
          </Fade>
        )}
      </Box>

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })} maxWidth="sm" fullWidth>
        <DialogTitle>¿Estás seguro?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta de{" "}
            <strong>{deleteDialog.user?.name}</strong> y todos sus datos asociados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => deleteUser(deleteDialog.user?.id)}
            color="error"
            variant="contained"
            disabled={actionLoading[`delete_${deleteDialog.user?.id}`]}
          >
            {actionLoading[`delete_${deleteDialog.user?.id}`] ? "Eliminando..." : "Sí, eliminar usuario"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
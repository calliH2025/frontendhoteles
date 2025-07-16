import { useState, useEffect } from "react"
import axios from "axios"
import {
  Box,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Typography,
  Modal,
  Fade,
  Avatar,
  Divider,
  Grid,
  Paper,
  Chip,
  InputAdornment,
} from "@mui/material"
import {
  Person as PersonIcon,
  PersonOutline as PersonOutlineIcon,
  Edit as EditIcon,
  AccountCircle as AccountCircleIcon,
  Badge as BadgeIcon,
  ContactPhone as ContactPhoneIcon,
  AlternateEmail as AlternateEmailIcon,
  VpnKey as VpnKeyIcon,
  AdminPanelSettings as AdminIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
} from "@mui/icons-material"

const PerfilUsuario = () => {
  const [userData, setUserData] = useState({
    Nombre: "",
    ApellidoP: "",
    ApellidoM: "",
    Telefono: "",
    Correo: "",
    Usuario: "",
    Password: "",
    Tipousuario: "",
  })
  const [editedData, setEditedData] = useState({
    Nombre: "",
    ApellidoP: "",
    ApellidoM: "",
    Telefono: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.")
      setIsLoading(false)
      return
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("https://backendreservas-m2zp.onrender.com/api/perfilusuario/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserData(response.data)
        setEditedData({
          Nombre: response.data.Nombre,
          ApellidoP: response.data.ApellidoP,
          ApellidoM: response.data.ApellidoM,
          Telefono: response.data.Telefono,
        })
        setError("")
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar el perfil.")
        console.error("Error al obtener perfil:", err.response?.data || err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    try {
      setIsLoading(true)
      await axios.put("https://backendreservas-m2zp.onrender.com/api/perfilusuario/", editedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUserData({ ...userData, ...editedData })
      setSuccess("Perfil actualizado exitosamente.")
      setError("")
      setIsModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.error || "Error al actualizar el perfil.")
      console.error("Error al actualizar perfil:", err.response?.data || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const getInitials = () => {
    return `${userData.Nombre?.charAt(0) || ""}${userData.ApellidoP?.charAt(0) || ""}`
  }

  const getUserTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "admin":
        return "#f44336"
      case "usuario":
        return "#2196f3"
      case "moderador":
        return "#ff9800"
      default:
        return "#4caf50"
    }
  }

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: "500px" },
    bgcolor: "white",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
    borderRadius: "20px",
    p: 0,
    outline: "none",
    maxHeight: "90vh",
    overflow: "auto",
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: { xs: "1rem", md: "2rem" },
        background: "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)",
      }}
    >
      <Container maxWidth="lg">  
        {/* Alertas */}
        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3, borderRadius: "15px" }} icon={<InfoIcon />}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            onClose={() => setSuccess("")}
            sx={{ mb: 3, borderRadius: "15px" }}
            icon={<InfoIcon />}
          >
            {success}
          </Alert>
        )}

        {isLoading ? (
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: "25px",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#667eea", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#667eea" }}>
              Cargando perfil...
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {/* Información Personal */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: "25px",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                    <PersonIcon sx={{ color: "#667eea", fontSize: 30, mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                      Información Personal
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value={userData.Nombre}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircleIcon sx={{ color: "#667eea" }} />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "15px",
                          backgroundColor: "#f8f9ff",
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Apellido Paterno"
                      value={userData.ApellidoP}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon sx={{ color: "#667eea" }} />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "15px",
                          backgroundColor: "#f8f9ff",
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Apellido Materno"
                      value={userData.ApellidoM}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon sx={{ color: "#667eea" }} />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "15px",
                          backgroundColor: "#f8f9ff",
                        },
                      }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={userData.Telefono}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <ContactPhoneIcon sx={{ color: "#667eea" }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "15px",
                        backgroundColor: "#f8f9ff",
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Información de Cuenta */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: "25px",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                    <SecurityIcon sx={{ color: "#764ba2", fontSize: 30, mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                      Información de Cuenta
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Correo Electrónico"
                      value={userData.Correo}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <AlternateEmailIcon sx={{ color: "#764ba2" }} />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "15px",
                          backgroundColor: "#faf8ff",
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Usuario"
                      value={userData.Usuario}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon sx={{ color: "#764ba2" }} />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "15px",
                          backgroundColor: "#faf8ff",
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Contraseña"
                      value="••••••••"
                      type="password"
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKeyIcon sx={{ color: "#764ba2" }} />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "15px",
                          backgroundColor: "#faf8ff",
                        },
                      }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Tipo de Usuario"
                    value={userData.Tipousuario}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <AdminIcon sx={{ color: getUserTypeColor(userData.Tipousuario) }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "15px",
                        backgroundColor: "#faf8ff",
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Botón de Editar */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<EditIcon />}
            onClick={openModal}
            color="primary"
          >
            Editar Perfil
          </Button>
        </Box>

        {/* Modal de Edición Mejorado */}
        <Modal open={isModalOpen} onClose={closeModal} closeAfterTransition>
          <Fade in={isModalOpen}>
            <Box sx={modalStyle}>
              {/* Header del Modal */}
              <Box
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  p: 3,
                  borderRadius: "20px 20px 0 0",
                  textAlign: "center",
                }}
              >
                <EditIcon sx={{ color: "white", fontSize: 40, mb: 1 }} />
                <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                  Editar Perfil
                </Typography>
              </Box>

              {/* Contenido del Modal */}
              <Box sx={{ p: 3 }}>
                {isLoading ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <CircularProgress sx={{ color: "#667eea" }} />
                  </Box>
                ) : error ? (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: "15px" }}>
                    {error}
                  </Alert>
                ) : (
                  <form onSubmit={handleUpdateProfile}>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        name="Nombre"
                        value={editedData.Nombre}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircleIcon sx={{ color: "#667eea" }} />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "15px",
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Apellido Paterno"
                        name="ApellidoP"
                        value={editedData.ApellidoP}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon sx={{ color: "#667eea" }} />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "15px",
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Apellido Materno"
                        name="ApellidoM"
                        value={editedData.ApellidoM}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon sx={{ color: "#667eea" }} />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "15px",
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Teléfono"
                        name="Telefono"
                        value={editedData.Telefono}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ContactPhoneIcon sx={{ color: "#667eea" }} />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "15px",
                          },
                        }}
                      />
                    </Box>

                    {/* Botones del Modal */}
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={isLoading}
                        sx={{
                          borderRadius: "15px",
                          px: 3,
                          background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)",
                          },
                        }}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={closeModal}
                        sx={{
                          borderRadius: "15px",
                          px: 3,
                          borderColor: "#f44336",
                          color: "#f44336",
                          "&:hover": {
                            borderColor: "#d32f2f",
                            backgroundColor: "rgba(244, 67, 54, 0.04)",
                          },
                        }}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  </form>
                )}
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Box>
  )
}

export default PerfilUsuario;
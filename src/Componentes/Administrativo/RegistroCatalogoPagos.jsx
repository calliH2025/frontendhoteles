import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider,
} from "@mui/material";
import { Payment, Add, Save } from "@mui/icons-material";
import axios from "axios";

const MetodoPago = () => {
  const [metodoPago, setMetodoPago] = useState("");
  const [tipoSeleccion, setTipoSeleccion] = useState("predefinido");
  const [customMetodo, setCustomMetodo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Opciones predefinidas de métodos de pago
  const metodosPredefinidos = [
    { value: "Mercado Pago", label: "Mercado Pago" },
    { value: "Tarjeta de Débito", label: "Tarjeta de Débito" },
    { value: "Tarjeta de Crédito", label: "Tarjeta de Crédito" },
    { value: "Transferencia Bancaria", label: "Transferencia Bancaria" },
    { value: "Efectivo", label: "Efectivo" },
    { value: "PayPal", label: "PayPal" },
  ];

  const handleTipoSeleccionChange = (event) => {
    setTipoSeleccion(event.target.value);
    setError("");
    // Limpiar valores cuando cambia el tipo de selección
    if (event.target.value === "predefinido") {
      setMetodoPago("");
      setCustomMetodo("");
    } else {
      setMetodoPago("");
      setCustomMetodo("");
    }
  };

  const handleMetodoPagoChange = (event) => {
    setMetodoPago(event.target.value);
    setError("");
  };

  const handleCustomMetodoChange = (event) => {
    setCustomMetodo(event.target.value);
    setError("");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Determinar el valor final del método de pago según el tipo de selección
    const valorFinal = tipoSeleccion === "predefinido" ? metodoPago : customMetodo;

    // Validar que se haya seleccionado o ingresado un método de pago
    if (!valorFinal) {
      setError("Debe seleccionar o ingresar un método de pago");
      return;
    }

    setLoading(true);

    try {
      // Enviar solicitud al backend para registrar el método de pago
      const response = await axios.post('https://backendreservas-m2zp.onrender.com/api/registrocatalogopagos/create', {
        metodopago: valorFinal
      });

      console.log('Respuesta del servidor:', response.data);

      // Mostrar mensaje de éxito
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Limpiar formulario
      if (tipoSeleccion === "predefinido") {
        setMetodoPago("");
      } else {
        setCustomMetodo("");
      }
    } catch (error) {
      console.error('Error al guardar el método de pago:', error.response?.data || error.message);
      setSnackbarMessage(error.response?.data?.error || 'Error al registrar el método de pago');
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 2 }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Payment color="primary" />
              <Typography variant="h5">Registrar Método de Pago</Typography>
            </Box>
          }
          subheader="Seleccione o ingrese un método de pago para registrar en el sistema"
        />

        <Divider />

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Tipo de registro</FormLabel>
              <RadioGroup row name="tipoSeleccion" value={tipoSeleccion} onChange={handleTipoSeleccionChange}>
                <FormControlLabel value="predefinido" control={<Radio />} label="Seleccionar de la lista" />
                <FormControlLabel value="personalizado" control={<Radio />} label="Ingresar nuevo" />
              </RadioGroup>
            </FormControl>

            {tipoSeleccion === "predefinido" ? (
              <FormControl fullWidth error={!!error && !metodoPago} sx={{ mb: 3 }}>
                <InputLabel id="metodo-pago-label">Método de Pago</InputLabel>
                <Select
                  labelId="metodo-pago-label"
                  id="metodo-pago-select"
                  value={metodoPago}
                  label="Método de Pago"
                  onChange={handleMetodoPagoChange}
                >
                  {metodosPredefinidos.map((metodo) => (
                    <MenuItem key={metodo.value} value={metodo.value}>
                      {metodo.label}
                    </MenuItem>
                  ))}
                </Select>
                {error && !metodoPago && <FormHelperText>{error}</FormHelperText>}
              </FormControl>
            ) : (
              <TextField
                fullWidth
                label="Nuevo Método de Pago"
                variant="outlined"
                value={customMetodo}
                onChange={handleCustomMetodoChange}
                error={!!error && !customMetodo}
                helperText={error && !customMetodo ? error : ""}
                placeholder="Ej: Billetera Virtual"
                InputProps={{
                  startAdornment: <Add sx={{ mr: 1, color: "action.active" }} />,
                }}
                sx={{ mb: 3 }}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={<Save />}
              sx={{ py: 1.5 }}
            >
              {loading ? "Guardando..." : "Guardar Método de Pago"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MetodoPago;
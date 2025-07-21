import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Button,
  Grid,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Security, CheckCircle, Speed } from "@mui/icons-material";

// Tarjeta de Mercado Pago recreada con CSS
const MercadoPagoIcon = () => (
  <Box
    sx={{
      width: 60,
      height: 40,
      borderRadius: "6px",
      background: "linear-gradient(135deg, #009EE3 0%, #0066CC 100%)",
      position: "relative",
      boxShadow: "0 2px 8px rgba(0, 158, 227, 0.3)",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: 8,
        left: 8,
        width: 12,
        height: 10,
        borderRadius: "2px",
        bgcolor: "#FFD700",
        border: "1px solid #FFC107",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 2,
          left: 2,
          right: 2,
          bottom: 2,
          border: "1px solid #FF8F00",
          borderRadius: "1px",
        },
      }}
    />
    <Box
      sx={{
        position: "absolute",
        bottom: 8,
        left: 8,
        color: "white",
        fontSize: "7px",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
      }}
    >
      MERCADO PAGO
    </Box>
    <Box
      sx={{
        position: "absolute",
        bottom: 16,
        left: 8,
        color: "rgba(255,255,255,0.9)",
        fontSize: "6px",
        fontFamily: "monospace",
        letterSpacing: "1px",
      }}
    >
      •••• ••••
    </Box>
    <Box
      sx={{
        position: "absolute",
        top: 20,
        left: 0,
        right: 0,
        height: 4,
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        top: 26,
        right: 8,
        width: 3,
        height: 3,
        borderRadius: "50%",
        bgcolor: "#FFE600",
        boxShadow: "0 0 4px rgba(255, 230, 0, 0.6)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        bottom: 6,
        right: 6,
        width: 8,
        height: 6,
        background:
          "linear-gradient(45deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 100%)",
        borderRadius: "1px",
        opacity: 0.8,
      }}
    />
  </Box>
);

// Tarjeta de Débito recreada con CSS
const DebitCardIcon = () => (
  <Box
    sx={{
      width: 60,
      height: 40,
      borderRadius: "6px",
      background: "linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)",
      position: "relative",
      boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: 8,
        left: 8,
        width: 12,
        height: 10,
        borderRadius: "2px",
        bgcolor: "#FFD700",
        border: "1px solid #FFC107",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 2,
          left: 2,
          right: 2,
          bottom: 2,
          border: "1px solid #FF8F00",
          borderRadius: "1px",
        },
      }}
    />
    <Box
      sx={{
        position: "absolute",
        bottom: 6,
        left: 8,
        color: "white",
        fontSize: "8px",
        fontWeight: "bold",
        fontFamily: "monospace",
      }}
    >
      DEBIT
    </Box>
    <Box
      sx={{
        position: "absolute",
        top: 18,
        left: 0,
        right: 0,
        height: 6,
        bgcolor: "rgba(0,0,0,0.3)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: "50%",
        bgcolor: "rgba(255,255,255,0.8)",
      }}
    />
  </Box>
);

// Tarjeta de Crédito recreada con CSS
const CreditCardIcon = () => (
  <Box
    sx={{
      width: 60,
      height: 40,
      borderRadius: "6px",
      background: "linear-gradient(135deg, #1A237E 0%, #3F51B5 50%, #2196F3 100%)",
      position: "relative",
      boxShadow: "0 2px 8px rgba(63, 81, 181, 0.3)",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: 8,
        left: 8,
        width: 12,
        height: 10,
        borderRadius: "2px",
        bgcolor: "#FFD700",
        border: "1px solid #FFC107",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 2,
          left: 2,
          right: 2,
          bottom: 2,
          border: "1px solid #FF8F00",
          borderRadius: "1px",
        },
      }}
    />
    <Box
      sx={{
        position: "absolute",
        bottom: 12,
        left: 8,
        color: "white",
        fontSize: "6px",
        fontFamily: "monospace",
        letterSpacing: "1px",
      }}
    >
      •••• ••••
    </Box>
    <Box
      sx={{
        position: "absolute",
        top: 6,
        right: 6,
        display: "flex",
        gap: "2px",
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: "#FF5F00",
          opacity: 0.8,
        }}
      />
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: "#EB001B",
          opacity: 0.8,
          marginLeft: "-2px",
        }}
      />
    </Box>
    <Box
      sx={{
        position: "absolute",
        bottom: 6,
        right: 8,
        width: 12,
        height: 8,
        background: "linear-gradient(45deg, #silver 0%, #gold 50%, #silver 100%)",
        borderRadius: "2px",
        opacity: 0.7,
      }}
    />
  </Box>
);

// Ícono por defecto para métodos desconocidos
const DefaultIcon = () => (
  <Box
    sx={{
      width: 60,
      height: 40,
      borderRadius: "6px",
      background: "linear-gradient(135deg, #616161 0%, #9e9e9e 100%)",
      position: "relative",
      boxShadow: "0 2px 8px rgba(97, 97, 97, 0.3)",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography
      sx={{
        color: "white",
        fontSize: "10px",
        fontWeight: "bold",
        textAlign: "center",
        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
      }}
    >
      PAGO
    </Typography>
  </Box>
);

const CatalogoPagos = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { id_usuario, id_habitacion, id_hotel, fechainicio, fechafin, tipo_tarifa, totalpagar } = location.state || {};

  // Mapa de propiedades para métodos de pago conocidos
  const methodProperties = {
    "Mercado Pago": {
      id: "mercadopago",
      description: "Paga con tu dinero en Mercado Pago o tarjetas",
      icon: <MercadoPagoIcon />,
      color: "#009EE3",
      gradient: "linear-gradient(135deg, #009EE3 0%, #0066CC 100%)",
      features: ["Protección al comprador", "Pago en cuotas", "Dinero en cuenta"],
      badge: "Más usado",
      subtitle: "Rápido y seguro",
    },
    "Tarjeta de Débito": {
      id: "debit",
      description: "Débito inmediato desde tu cuenta bancaria",
      icon: <DebitCardIcon />,
      color: "#4CAF50",
      gradient: "linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)",
      features: ["Pago inmediato", "Sin intereses", "Desde tu banco"],
      badge: "Seguro",
      subtitle: "Directo de tu cuenta",
    },
    "Tarjeta de Crédito": {
      id: "credit",
      description: "Visa",
      icon: <CreditCardIcon />,
      color: "#3F51B5",
      gradient: "linear-gradient(135deg, #1A237E 0%, #3F51B5 50%, #2196F3 100%)",
      features: ["Pago en cuotas", "Todas las marcas", "Cashback disponible"],
      badge: "Flexible",
      subtitle: "Hasta 12 cuotas",
    },
  };

  // Propiedades por defecto para métodos desconocidos
  const defaultProperties = {
    description: "Método de pago personalizado",
    icon: <DefaultIcon />,
    color: "#616161",
    gradient: "linear-gradient(135deg, #616161 0%, #9e9e9e 100%)",
    features: ["Pago seguro", "Disponible para transacciones"],
    badge: null,
    subtitle: "Método personalizado",
  };

  // Fetch payment methods from backend
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('https://backendreservas-m2zp.onrender.com/api/registrocatalogopagos/list');
        console.log('Métodos de pago recibidos:', response.data);

        // Mapear los métodos de pago recibidos con sus propiedades
        const formattedMethods = response.data.map((method) => ({
          id: method.id.toString(), // Convertir a string para consistencia con RadioGroup
          name: method.name,
          ...(methodProperties[method.name] || defaultProperties),
        }));

        setPaymentMethods(formattedMethods);
      } catch (error) {
        console.error('Error al obtener métodos de pago:', error);
        setError('No se pudieron cargar los métodos de pago. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentMethods();
  }, []);

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
  };

const handleContinue = async () => {
  console.log("Datos enviados a crear-preferencia:", {
    id_usuario,
    id_habitacion,
    fechainicio,
    fechafin,
    tipo_tarifa,
    totalpagar,
  });

  if (!selectedMethod) {
    setError("Por favor, selecciona un método de pago.");
    return;
  }

  if (!id_usuario || !id_habitacion || !fechainicio || !fechafin || !tipo_tarifa || !totalpagar) {
    setError("Datos de reserva incompletos. Por favor, regresa y completa la información.");
    return;
  }

  if (selectedMethod === methodProperties["Mercado Pago"].id) {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://backendreservas-m2zp.onrender.com/api/mercadopago/crear-preferencia",
        {
          id_usuario,
          id_habitacion,
          fechainicio,
          fechafin,
          tipo_tarifa,
          totalpagar,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const { init_point, external_reference } = response.data;
      localStorage.setItem("external_reference", external_reference); // Almacenar para uso en historial
      window.location.href = init_point;
    } catch (err) {
      setError(err.response?.data?.error || "Error al generar el enlace de pago. Intenta de nuevo.");
      console.error("Error al crear preferencia:", err);
    } finally {
      setLoading(false);
    }
  } else {
    setError("Método de pago no implementado aún. Selecciona Mercado Pago.");
  }
};

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 700, margin: 'auto', mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, margin: "auto", mt: 4 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid #e0e0e0",
          overflow: "visible",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        }}
      >
        <CardHeader
          sx={{ pb: 1, pt: 3 }}
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Security sx={{ color: "#4CAF50", fontSize: 28 }} />
              <Typography variant="h4" component="h2" fontWeight="700" color="#1a1a1a">
                Método de pago
              </Typography>
            </Box>
          }
          subheader={
            <Box>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontSize: "16px" }}>
                Selecciona cómo quieres pagar de forma segura y protegida
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: "600" }}>
                Total a pagar: ${totalpagar} MXN
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Fechas: {new Date(fechainicio).toLocaleString()} - {new Date(fechafin).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Tipo de tarifa: {tipo_tarifa}
              </Typography>
            </Box>
          }
        />

        <CardContent sx={{ pt: 3, px: 3 }}>
          <RadioGroup value={selectedMethod} onChange={handleMethodChange} name="payment-methods">
            <Grid container spacing={3}>
              {paymentMethods.map((method) => (
                <Grid item xs={12} key={method.id}>
                  <Paper
                    elevation={selectedMethod === method.id ? 12 : 3}
                    sx={{
                      p: 3,
                      cursor: "pointer",
                      border: selectedMethod === method.id ? `3px solid ${method.color}` : "3px solid transparent",
                      borderRadius: 4,
                      background:
                        selectedMethod === method.id
                          ? `linear-gradient(135deg, ${method.color}08 0%, ${method.color}15 100%)`
                          : "white",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        elevation: 8,
                        transform: "translateY(-6px)",
                        "& .method-icon": {
                          transform: "scale(1.1) rotateY(5deg)",
                        },
                      },
                      "&::before":
                        selectedMethod === method.id
                          ? {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 5,
                              background: method.gradient,
                            }
                          : {},
                    }}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    {method.badge && (
                      <Chip
                        label={method.badge}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          bgcolor: method.color,
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "11px",
                          height: 24,
                        }}
                      />
                    )}

                    <FormControlLabel
                      value={method.id}
                      control={
                        <Radio
                          sx={{
                            color: method.color,
                            "&.Mui-checked": {
                              color: method.color,
                            },
                            "& .MuiSvgIcon-root": {
                              fontSize: 24,
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%", ml: 2 }}>
                          <Box
                            className="method-icon"
                            sx={{
                              mr: 3,
                              mt: 0.5,
                              transition: "transform 0.4s ease",
                              transformStyle: "preserve-3d",
                            }}
                          >
                            {method.icon}
                          </Box>

                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                              <Typography variant="h5" component="div" fontWeight="700" color="#1a1a1a">
                                {method.name}
                              </Typography>
                              {selectedMethod === method.id && (
                                <CheckCircle sx={{ color: method.color, fontSize: 24 }} />
                              )}
                            </Box>

                            <Typography
                              variant="body2"
                              sx={{
                                color: method.color,
                                fontWeight: "600",
                                mb: 1,
                                fontSize: "13px",
                              }}
                            >
                              {method.subtitle}
                            </Typography>

                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: "15px" }}>
                              {method.description}
                            </Typography>

                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                              {method.features.map((feature, index) => (
                                <Chip
                                  key={index}
                                  label={feature}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor: selectedMethod === method.id ? method.color : "grey.300",
                                    color: selectedMethod === method.id ? method.color : "text.secondary",
                                    fontSize: "12px",
                                    height: 26,
                                    fontWeight: "500",
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      }
                      sx={{
                        margin: 0,
                        width: "100%",
                        alignItems: "flex-start",
                        "& .MuiFormControlLabel-label": {
                          width: "100%",
                        },
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box>
              {selectedMethod ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircle
                    sx={{ color: paymentMethods.find((m) => m.id === selectedMethod)?.color, fontSize: 24 }}
                  />
                  <Typography variant="h6" fontWeight="600" color="#1a1a1a">
                    {paymentMethods.find((m) => m.id === selectedMethod)?.name} seleccionado
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Selecciona un método de pago para continuar
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              disabled={!selectedMethod || loading}
              startIcon={<Speed />}
              sx={{
                minWidth: 160,
                height: 52,
                borderRadius: 3,
                background: selectedMethod ? paymentMethods.find((m) => m.id === selectedMethod)?.gradient : "grey.400",
                fontWeight: "700",
                textTransform: "none",
                fontSize: "16px",
                boxShadow: selectedMethod ? 4 : 1,
                "&:hover": {
                  boxShadow: 8,
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  background: "grey.300",
                  color: "grey.500",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Continuar pago"}
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              p: 3,
              bgcolor: "rgba(76, 175, 80, 0.05)",
              borderRadius: 3,
              border: "1px solid rgba(76, 175, 80, 0.2)",
            }}
          >
            <Security sx={{ color: "#4CAF50", fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary" fontWeight="600">
              🔒 Conexión segura SSL • Datos protegidos • Compra garantizada
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CatalogoPagos;
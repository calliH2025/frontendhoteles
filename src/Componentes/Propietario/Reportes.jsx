
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Download,
  AttachMoney,
  EventNote,
  TrendingUp,
  CalendarToday,
  CheckCircle,
} from "@mui/icons-material";

export default function ReporteReservas() {
  const [periodo, setPeriodo] = useState("dia");
  const [reportes, setReportes] = useState({
    porDia: [],
    porMes: [],
    porAnio: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      setIsLoading(false);
      return;
    }

    const fetchReportes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://backendreservas-m2zp.onrender.com/api/gestionreservas/reportes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Asegurar que todas las claves existan en la respuesta
        setReportes({
          porDia: response.data.porDia || [],
          porMes: response.data.porMes || [],
          porAnio: response.data.porAnio || [],
        });
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar los reportes.");
        console.error("Error al obtener reportes:", err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportes();
  }, []);

  const formatDate = (dateString) => {
    return moment.tz(dateString, "America/Mexico_City").format("DD/MM/YYYY");
  };

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // Establecer fuente personalizada
    doc.setFont("helvetica", "bold");

    // Encabezado del PDF
    doc.setFillColor(33, 150, 243);
    doc.rect(0, 0, pageWidth, 30, "F");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("Reporte de Reservas", pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(
      `Generado el: ${moment.tz("America/Mexico_City").format("DD/MM/YYYY HH:mm:ss")}`,
      pageWidth / 2,
      25,
      { align: "center" }
    );

    // Resetear colores para el contenido
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    let tableTop = 40;

    // Sección por Día
    if (reportes.porDia?.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Total por Día", margin, tableTop);
      doc.setFont("helvetica", "normal");
      autoTable(doc, {
        startY: tableTop + 5,
        head: [["Fecha", "Total ($)", "Reservas"]],
        body: reportes.porDia.map((row) => [
          formatDate(row.fecha),
          formatearMoneda(row.total),
          row.cantidad_reservas,
        ]),
        theme: "grid",
        styles: { font: "helvetica", fontSize: 10, cellPadding: 3, textColor: [33, 33, 33] },
        headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: margin, right: margin },
      });
      tableTop = doc.lastAutoTable.finalY + 10;
    }

    // Sección por Mes
    if (reportes.porMes?.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Total por Mes", margin, tableTop);
      doc.setFont("helvetica", "normal");
      autoTable(doc, {
        startY: tableTop + 5,
        head: [["Mes", "Total ($)", "Reservas"]],
        body: reportes.porMes.map((row) => [
          moment(row.mes, "YYYY-MM").format("MMMM YYYY"),
          formatearMoneda(row.total),
          row.cantidad_reservas,
        ]),
        theme: "grid",
        styles: { font: "helvetica", fontSize: 10, cellPadding: 3, textColor: [33, 33, 33] },
        headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: margin, right: margin },
      });
      tableTop = doc.lastAutoTable.finalY + 10;
    }

    // Sección por Año
    if (reportes.porAnio?.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Total por Año", margin, tableTop);
      doc.setFont("helvetica", "normal");
      autoTable(doc, {
        startY: tableTop + 5,
        head: [["Año", "Total ($)", "Reservas"]],
        body: reportes.porAnio.map((row) => [
          row.anio,
          formatearMoneda(row.total),
          row.cantidad_reservas,
        ]),
        theme: "grid",
        styles: { font: "helvetica", fontSize: 10, cellPadding: 3, textColor: [33, 33, 33] },
        headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: margin, right: margin },
      });
      tableTop = doc.lastAutoTable.finalY + 10;
    }

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Reporte generado por Sistema de Gestión de Reservas",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    // Descargar el PDF
    doc.save(
      `reporte_reservas_${moment
        .tz("America/Mexico_City")
        .format("YYYYMMDD_HHmmss")}.pdf`
    );
  };

  // Calcular estadísticas para el período seleccionado
  const datos = () => {
    let total = 0;
    let reservas = 0;
    let promedio = 0;
    let fecha = "";

    if (periodo === "dia" && reportes.porDia?.length > 0) {
      total = reportes.porDia.reduce((sum, row) => sum + Number(row.total), 0);
      reservas = reportes.porDia.reduce((sum, row) => sum + Number(row.cantidad_reservas), 0);
      promedio = reservas > 0 ? total / reservas : 0;
      fecha = `Hoy - ${formatDate(reportes.porDia[0].fecha)}`;
    } else if (periodo === "mes" && reportes.porMes?.length > 0) {
      total = reportes.porMes.reduce((sum, row) => sum + Number(row.total), 0);
      reservas = reportes.porMes.reduce((sum, row) => sum + Number(row.cantidad_reservas), 0);
      promedio = reservas > 0 ? total / reservas : 0;
      fecha = moment(reportes.porMes[0].mes, "YYYY-MM").format("MMMM YYYY");
    } else if (periodo === "año" && reportes.porAnio?.length > 0) {
      total = reportes.porAnio.reduce((sum, row) => sum + Number(row.total), 0);
      reservas = reportes.porAnio.reduce((sum, row) => sum + Number(row.cantidad_reservas), 0);
      promedio = reservas > 0 ? total / reservas : 0;
      fecha = reportes.porAnio[0]?.anio?.toString() || "Sin datos";
    }

    return { total, reservas, promedio, fecha };
  };

  const datosReporte = datos();

  const handlePeriodoChange = (event) => {
    setPeriodo(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Reporte de Reservas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Resumen de ganancias y estadísticas de reservas
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Período</InputLabel>
              <Select value={periodo} label="Período" onChange={handlePeriodoChange}>
                <MenuItem value="dia">Por Día</MenuItem>
                <MenuItem value="mes">Por Mes</MenuItem>
                <MenuItem value="año">Por Año</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={generatePDF}
              sx={{ whiteSpace: "nowrap", backgroundColor: "#2196f3", "& stelle": { backgroundColor: "#1976d2" } }}
            >
              Generar PDF
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Período seleccionado */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <CalendarToday fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Período: {datosReporte.fecha}
          </Typography>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress sx={{ color: "primary.main" }} />
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
            Cargando reportes...
          </Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" onClose={() => setError("")} sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Métricas principales */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Ganado
                    </Typography>
                    <AttachMoney color="action" />
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="success.main"
                    gutterBottom
                  >
                    {formatearMoneda(datosReporte.total)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {periodo === "dia"
                      ? "Ganancias del día"
                      : periodo === "mes"
                      ? "Ganancias del mes"
                      : "Ganancias del año"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Reservas
                    </Typography>
                    <EventNote color="action" />
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary.main"
                    gutterBottom
                  >
                    {datosReporte.reservas}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {periodo === "dia"
                      ? "Reservas del día"
                      : periodo === "mes"
                      ? "Reservas del mes"
                      : "Reservas del año"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Promedio por Reserva
                    </Typography>
                    <TrendingUp color="action" />
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="secondary.main"
                    gutterBottom
                  >
                    {formatearMoneda(datosReporte.promedio)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Valor promedio por reserva
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detalles adicionales */}
          <Card elevation={3} sx={{ mb: 3, borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <EventNote color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Resumen del Reporte
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Información detallada del período seleccionado
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="overline" color="text.secondary" display="block">
                    PERÍODO
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {datosReporte.fecha}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="overline" color="text.secondary" display="block">
                    ESTADO
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <CheckCircle fontSize="small" color="success" />
                    <Typography variant="body2">Datos actualizados</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Ingresos totales:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatearMoneda(datosReporte.total)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Número de reservas:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {datosReporte.reservas}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Ticket promedio:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatearMoneda(datosReporte.promedio)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tabla detallada */}
          {reportes[`por${periodo.charAt(0).toUpperCase() + periodo.slice(1)}`]?.length > 0 && (
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Detalle {periodo === "dia" ? "Diario" : periodo === "mes" ? "Mensual" : "Anual"}
                </Typography>
                <Paper elevation={2} sx={{ overflowX: "auto" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "#2196f3" }}>
                          {periodo === "dia" ? "Fecha" : periodo === "mes" ? "Mes" : "Año"}
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#2196f3" }}>Total ($)</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#2196f3" }}>Reservas</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportes[`por${periodo.charAt(0).toUpperCase() + periodo.slice(1)}`].map((row) => (
                        <TableRow
                          key={periodo === "dia" ? row.fecha : periodo === "mes" ? row.mes : row.anio}
                          sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
                        >
                          <TableCell>
                            {periodo === "dia"
                              ? formatDate(row.fecha)
                              : periodo === "mes"
                              ? moment(row.mes, "YYYY-MM").format("MMMM YYYY")
                              : row.anio}
                          </TableCell>
                          <TableCell>{formatearMoneda(row.total)}</TableCell>
                          <TableCell>{row.cantidad_reservas}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </CardContent>
            </Card>
          )}

          {/* Nota sobre PDF */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "2px dashed",
              borderColor: "divider",
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Download color="action" sx={{ mt: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                El PDF incluirá todos los datos mostrados y un desglose detallado de las reservas del período seleccionado.
              </Typography>
            </Box>
          </Paper>

          {(!reportes.porDia?.length && !reportes.porMes?.length && !reportes.porAnio?.length) && (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
              No hay reportes para mostrar en este momento.
            </Typography>
          )}
        </>
      )}
    </Container>
  );
}
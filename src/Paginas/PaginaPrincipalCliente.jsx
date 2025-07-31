import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export default function HomePage() {
  const carouselRef = useRef(null);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrusel mostrará los hoteles destacados
  const carouselHotels = hotels.slice(0, 4); // Mostrar solo los primeros 4 hoteles

  // Auto scroll carrusel cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const container = carouselRef.current;
      if (container && carouselHotels.length > 1) {
        const scrollWidth = container.scrollWidth;
        const scrollLeft = container.scrollLeft;
        const cardWidth = container.offsetWidth;
        const nextScroll = scrollLeft + cardWidth >= scrollWidth ? 0 : scrollLeft + cardWidth;
        container.scrollTo({ left: nextScroll, behavior: "smooth" });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselHotels.length]);

  // Función para obtener datos de la API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [hotelesRes, cuartosRes] = await Promise.all([
        fetch("https://backendreservas-m2zp.onrender.com/api/detallehotel/public"),
        fetch("https://backendreservas-m2zp.onrender.com/api/detallesHabitacion/public"),
      ]);

      if (!hotelesRes.ok) {
        throw new Error(`Error en hoteles: ${hotelesRes.status}`);
      }
      if (!cuartosRes.ok) {
        throw new Error(`Error en cuartos: ${cuartosRes.status}`);
      }

      const hotelesData = await hotelesRes.json();
      const cuartosData = await cuartosRes.json();

      console.log("Hoteles Data:", hotelesData);
      console.log("Cuartos Data:", cuartosData);

      // Mapear los datos de hoteles para incluir el campo 'id'
      const hotelesMapeados = hotelesData.map((hotel) => ({
        ...hotel,
        id: hotel.id_hotel,
      }));

      setHotels(hotelesMapeados.slice(0, 6));
      
      // Mapear los datos de habitaciones para asegurar que tengan el campo 'id'
      const habitacionesMapeadas = cuartosData.map((room) => ({
        ...room,
        id: room.id,
      }));
      
      setRooms(habitacionesMapeadas.slice(0, 8));
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError(error.message);
      setHotels([]);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Función para procesar imágenes
  const getImageSrc = (imagen) => {
    if (!imagen) {
      return "https://via.placeholder.com/320x180/FF6B35/ffffff?text=Imagen+No+Disponible";
    }
    try {
      if (typeof imagen === "object" && imagen.data && imagen.mimeType) {
        return `data:${imagen.mimeType};base64,${imagen.data}`;
      }
      if (typeof imagen === "string" && imagen.match(/^https?:\/\//)) {
        return imagen;
      }
      if (typeof imagen === "string" && imagen.match(/^[A-Za-z0-9+/=]+$/)) {
        return `data:image/jpeg;base64,${imagen}`;
      }
      return "https://via.placeholder.com/320x180/FF6B35/ffffff?text=Imagen+No+Disponible";
    } catch (error) {
      console.error("Error al procesar imagen:", error.message);
      return "https://via.placeholder.com/320x180/FF6B35/ffffff?text=Imagen+No+Disponible";
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", px: 2 }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
                 {/* Sección Carrusel */}
         <Box sx={{ py: { xs: 4, md: 6, lg: 8 }, bgcolor: "background.paper" }}>
           <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
             Hoteles Destacados
           </Typography>
           {loading ? (
             <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
               <CircularProgress />
             </Box>
           ) : carouselHotels.length === 0 ? (
             <Box sx={{ textAlign: "center", py: 4 }}>
               <Typography variant="h6" color="text.secondary">
                 No hay hoteles disponibles para mostrar
               </Typography>
             </Box>
           ) : (
             <Box
               ref={carouselRef}
               sx={{
                 display: "flex",
                 overflowX: "auto",
                 scrollSnapType: "x mandatory",
                 scrollBehavior: "smooth",
                 px: { xs: 2, md: 4 },
                 py: 2,
                 gap: 3,
                 maxWidth: "1200px",
                 mx: "auto",
                 "&::-webkit-scrollbar": { display: "none" },
               }}
             >
               {carouselHotels.map((hotel, index) => (
                 <Box
                   key={hotel.id}
                   sx={{
                     flexShrink: 0,
                     width: { xs: "90vw", md: 700, lg: 800 },
                     height: { xs: 200, md: 300, lg: 400 },
                     position: "relative",
                     borderRadius: 3,
                     overflow: "hidden",
                     scrollSnapAlign: "start",
                     boxShadow: 3,
                     cursor: "pointer",
                     transition: "transform 0.3s ease",
                     "&:hover": {
                       transform: "scale(1.02)",
                     },
                   }}
                   onClick={() => window.location.href = `/cliente/detalles-hoteles/${hotel.id}`}
                 >
                   <img
                     src={getImageSrc(hotel.imagen)}
                     alt={hotel.nombrehotel}
                     style={{
                       width: "100%",
                       height: "100%",
                       objectFit: "cover",
                       borderRadius: "inherit",
                       position: "absolute",
                       top: 0,
                       left: 0,
                     }}
                   />
                   <Box
                     sx={{
                       position: "absolute",
                       inset: 0,
                       background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3), transparent)",
                       display: "flex",
                       flexDirection: "column",
                       justifyContent: "flex-end",
                       p: 3,
                     }}
                   >
                     <Typography variant="h5" color="white" sx={{ fontWeight: 600, mb: 1 }}>
                       {hotel.nombrehotel}
                     </Typography>
                     <Typography variant="body1" color="white" sx={{ mb: 2, opacity: 0.9 }}>
                       {hotel.descripcion || "Hotel con excelentes servicios y comodidades"}
                     </Typography>
                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                       <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                         {hotel.numhabitacion || "N/A"} habitaciones
                       </Typography>
                       <Typography variant="h6" color="white" sx={{ fontWeight: 600 }}>
                         ${hotel.preciodia || "N/A"}/día
                       </Typography>
                     </Box>
                   </Box>
                 </Box>
               ))}
             </Box>
           )}
         </Box>

        {/* Sección Hoteles */}
        <Box sx={{ py: { xs: 6, md: 12, lg: 16 }, px: { xs: 2, md: 4 } }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h4" gutterBottom>
              Nuestros Hoteles Destacados
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 900, mx: "auto" }}>
              Explora una selección de los mejores hoteles para tu estancia.
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="error" variant="h6">
                Error al cargar hoteles: {error}
              </Typography>
              <Button 
                variant="contained" 
                onClick={fetchData}
                sx={{ mt: 2 }}
              >
                Reintentar
              </Button>
            </Box>
          ) : hotels.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No hay hoteles disponibles
              </Typography>
            </Box>
          ) : (
                         <Grid container spacing={4}>
               {hotels.map((hotel) => (
                                                                       <Grid item xs={12} sm={6} md={4} lg={3} key={hotel.id_hotel}>
                     <Card sx={{ 
                       height: 450, 
                       boxShadow: 3, 
                       borderRadius: 2,
                       display: "flex",
                       flexDirection: "column",
                       overflow: "hidden"
                     }}>
                                                                                                               <Box sx={{ 
                          height: 200, 
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f5f5f5",
                          flexShrink: 0,
                          flexGrow: 0,
                          minHeight: 200,
                          maxHeight: 200
                        }}>
                          <img
                            src={getImageSrc(hotel.imagen)}
                            alt={hotel.nombrehotel}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                              objectPosition: "center"
                            }}
                          />
                        </Box>
                                                                                        <CardContent sx={{ 
                         flexGrow: 1,
                         display: "flex",
                         flexDirection: "column",
                         p: 2,
                         overflow: "hidden",
                         minHeight: 180
                       }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mb: 1,
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            lineHeight: 1.3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {hotel.nombrehotel}
                        </Typography>
                       <Typography 
                         variant="body2" 
                         color="text.secondary"
                         sx={{ 
                           mb: 2,
                           flexGrow: 1,
                           lineHeight: 1.4,
                           display: "-webkit-box",
                           WebkitLineClamp: 3,
                           WebkitBoxOrient: "vertical",
                           overflow: "hidden"
                         }}
                       >
                         {hotel.descripcion || "Hotel con excelentes servicios y comodidades"}
                       </Typography>
                       <Box sx={{ 
                         mt: "auto",
                         display: "flex", 
                         justifyContent: "space-between",
                         alignItems: "center"
                       }}>
                         <Typography variant="body2" color="text.secondary">
                           {hotel.numhabitacion || "N/A"} habitaciones
                         </Typography>
                         <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
                           ${hotel.preciodia || "N/A"}/día
                         </Typography>
                       </Box>
                     </CardContent>
                     <CardActions sx={{ p: 2, pt: 0 }}>
                       <Link to={`/cliente/detalles-hoteles/${hotel.id}`} style={{ textDecoration: "none", width: "100%" }}>
                         <Button 
                           size="small" 
                           variant="contained"
                           fullWidth
                           sx={{ 
                             borderRadius: 1,
                             textTransform: "none",
                             fontWeight: 600
                           }}
                         >
                           Ver Detalles
                         </Button>
                       </Link>
                     </CardActions>
                   </Card>
                 </Grid>
               ))}
             </Grid>
          )}
        </Box>

        {/* Sección Habitaciones */}
        <Box sx={{ py: { xs: 6, md: 12, lg: 16 }, px: { xs: 2, md: 4 }, bgcolor: "background.paper" }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h4" gutterBottom>
              Tipos de Habitaciones
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 900, mx: "auto" }}>
              Encuentra la habitación perfecta para tus necesidades.
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="error" variant="h6">
                Error al cargar habitaciones: {error}
              </Typography>
              <Button 
                variant="contained" 
                onClick={fetchData}
                sx={{ mt: 2 }}
              >
                Reintentar
              </Button>
            </Box>
          ) : rooms.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No hay habitaciones disponibles
              </Typography>
            </Box>
          ) : (
                         <Grid container spacing={4}>
               {rooms.map((room) => (
                                   <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
                    <Card sx={{ 
                      height: 450, 
                      boxShadow: 3, 
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden"
                    }}>
                                                                                       <Box sx={{ 
                         height: 200, 
                         width: "100%",
                         display: "flex",
                         alignItems: "center",
                         justifyContent: "center",
                         backgroundColor: "#f5f5f5",
                         flexShrink: 0,
                         flexGrow: 0,
                         minHeight: 200,
                         maxHeight: 200
                       }}>
                         <img
                           src={getImageSrc(room.imagenhabitacion)}
                           alt={room.cuarto}
                           style={{
                             maxWidth: "100%",
                             maxHeight: "100%",
                             objectFit: "contain",
                             objectPosition: "center"
                           }}
                         />
                       </Box>
                                           <CardContent sx={{ 
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                        overflow: "hidden",
                        minHeight: 180
                      }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mb: 1,
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            lineHeight: 1.3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          Habitación {room.cuarto}
                        </Typography>
                       <Typography 
                         variant="body2" 
                         color="text.secondary"
                         sx={{ 
                           mb: 2,
                           flexGrow: 1,
                           lineHeight: 1.4,
                           display: "-webkit-box",
                           WebkitLineClamp: 3,
                           WebkitBoxOrient: "vertical",
                           overflow: "hidden"
                         }}
                       >
                         {room.descripcion || "Habitación cómoda y moderna"}
                       </Typography>
                       <Box sx={{ 
                         mt: "auto",
                         display: "flex", 
                         justifyContent: "space-between",
                         alignItems: "center"
                       }}>
                         <Typography variant="body2" color="text.secondary">
                           Estado: {room.estado || ""}
                         </Typography>
                         <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
                           ${room.preciodia || ""}/día
                         </Typography>
                       </Box>
                     </CardContent>
                     <CardActions sx={{ p: 2, pt: 0 }}>
                       <Link to={`/cliente/detalles-habitacionc/${room.id}`} style={{ textDecoration: "none", width: "100%" }}>
                         <Button 
                           size="small" 
                           variant="contained"
                           fullWidth
                           sx={{ 
                             borderRadius: 1,
                             textTransform: "none",
                             fontWeight: 600
                           }}
                         >
                           Reservar
                         </Button>
                       </Link>
                     </CardActions>
                   </Card>
                 </Grid>
               ))}
             </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
}

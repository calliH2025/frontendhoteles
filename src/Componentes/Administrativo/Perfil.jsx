import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

const Perfil = () => {
    const [perfil, setPerfil] = useState({
        NombreEmpresa: '',
        Eslogan: '',
        logo: null,
        Direccion: '',
        Correo: '',
        Telefono: ''
    });
    const [perfiles, setPerfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchPerfiles = async () => {
            try {
                const response = await axios.get('https://backendreservas-m2zp.onrender.com/api/perfil');
                console.log('Datos recibidos del backend:', response.data);
                setPerfiles(response.data);
            } catch (error) {
                console.error('Error al obtener perfiles:', error.message);
            }
        };
        fetchPerfiles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Telefono') {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setPerfil({
                    ...perfil,
                    [name]: value,
                });
            }
        } else if (name === 'NombreEmpresa' || name === 'Eslogan') {
            const regex = /^[a-zA-Z0-9 ]*$/;
            if (regex.test(value) && value.length <= 50) {
                setPerfil({
                    ...perfil,
                    [name]: value,
                });
            }
        } else {
            setPerfil({
                ...perfil,
                [name]: value,
            });
        }
    };

    const handleLogoChange = (e) => {
        setPerfil({
            ...perfil,
            logo: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['Eslogan', 'Direccion', 'Correo', 'Telefono'];
        const allFieldsFilled = requiredFields.every(field => perfil[field]);
        const isPhoneValid = /^\d{10}$/.test(perfil.Telefono);

        if (!allFieldsFilled || !isPhoneValid) {
            let message = "Por favor, llena todos los campos";
            if (!isPhoneValid) {
                message = "El teléfono debe tener exactamente 10 dígitos numéricos.";
            }
            MySwal.fire({
                title: 'Error!',
                text: message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const formData = new FormData();
        formData.append('nombreEmpresa', perfil.NombreEmpresa);
        formData.append('eslogan', perfil.Eslogan);
        formData.append('direccion', perfil.Direccion);
        formData.append('correo', perfil.Correo);
        formData.append('telefono', perfil.Telefono);
        if (perfil.logo) {
            formData.append('logo', perfil.logo);
        }

        try {
            if (editingId) {
                await axios.put(`https://backendreservas-m2zp.onrender.com/api/perfil/${editingId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'El perfil ha sido actualizado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                await axios.post('https://backendreservas-m2zp.onrender.com/api/perfil', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'El perfil ha sido creado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }

            setPerfil({
                NombreEmpresa: '',
                Eslogan: '',
                logo: null,
                Direccion: '',
                Correo: '',
                Telefono: ''
            });
            setEditingId(null);
            const response = await axios.get('https://backendreservas-m2zp.onrender.com/api/perfil');
            setPerfiles(response.data);
        } catch (error) {
            console.error('Error al guardar perfil:', error.message);
            MySwal.fire({
                title: 'Error!',
                text: 'No se pudo guardar el perfil.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto después de eliminarlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`https://backendreservas-m2zp.onrender.com/api/perfil/${id}`);
                setPerfiles(perfiles.filter(p => p.id !== id));
                Swal.fire(
                    'Eliminado!',
                    'El perfil ha sido eliminado.',
                    'success'
                );
            } catch (error) {
                console.error('Error al eliminar perfil:', error.message);
                Swal.fire(
                    'Error!',
                    'Hubo un problema al intentar eliminar el perfil.',
                    'error'
                );
            }
        }
    };

    const handleEdit = (perfil) => {
        setPerfil({
            NombreEmpresa: perfil.NombreEmpresa,
            Eslogan: perfil.Eslogan,
            logo: null,
            Direccion: perfil.Direccion,
            Correo: perfil.Correo,
            Telefono: perfil.Telefono
        });
        setEditingId(perfil.id);
        
        // Scroll suave hacia el formulario
        document.querySelector('[data-form-section]')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    };

    const handleCancel = () => {
        setPerfil({
            NombreEmpresa: '',
            Eslogan: '',
            logo: null,
            Direccion: '',
            Correo: '',
            Telefono: ''
        });
        setEditingId(null);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>
                    <FaBuilding style={styles.titleIcon} />
                    Gestión de Perfiles Empresariales
                </h1>
                <p style={styles.subtitle}>
                    Administra la información de tu empresa de manera profesional
                </p>
            </div>

            <div style={styles.flexContainer}>
                <section style={styles.gestionPerfilContainer} data-form-section>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>
                            {editingId ? "Editar Perfil" : "Nuevo Perfil"}
                        </h2>
                        <div style={styles.sectionLine}></div>
                    </div>
                    
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    <FaBuilding style={styles.labelIcon} />
                                    Nombre de la Empresa
                                </label>
                                <input
                                    type="text"
                                    name="NombreEmpresa"
                                    placeholder="Ingresa el nombre de tu empresa"
                                    value={perfil.NombreEmpresa}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    ✨ Eslogan
                                </label>
                                <input
                                    type="text"
                                    name="Eslogan"
                                    placeholder="Tu eslogan corporativo"
                                    value={perfil.Eslogan}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    🖼️ Logo de la Empresa
                                </label>
                                <div style={styles.fileInputContainer}>
                                    <input
                                        type="file"
                                        name="logo"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        style={styles.fileInput}
                                        id="logo-upload"
                                    />
                                    <label htmlFor="logo-upload" style={styles.fileInputLabel}>
                                        Seleccionar Imagen
                                    </label>
                                </div>
                            </div>
                            
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    <FaMapMarkerAlt style={styles.labelIcon} />
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    name="Direccion"
                                    placeholder="Dirección completa"
                                    value={perfil.Direccion}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    <FaEnvelope style={styles.labelIcon} />
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    name="Correo"
                                    placeholder="correo@empresa.com"
                                    value={perfil.Correo}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    <FaPhone style={styles.labelIcon} />
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    name="Telefono"
                                    placeholder="1234567890"
                                    value={perfil.Telefono}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                                <span style={styles.helperText}>10 dígitos numéricos</span>
                            </div>
                        </div>
                        
                        <div style={styles.buttonGroup}>
                            <button type="submit" style={styles.primaryButton}>
                                {editingId ? "💾 Actualizar Perfil" : "✨ Crear Perfil"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={styles.secondaryButton}
                            >
                                ❌ Cancelar
                            </button>
                        </div>
                    </form>
                </section>

                <section style={styles.perfilesGuardadosContainer}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Perfiles Guardados</h2>
                        <div style={styles.sectionLine}></div>
                    </div>
                    
                    <div style={styles.profilesGrid}>
                        {perfiles.length === 0 ? (
                            <div style={styles.emptyState}>
                                <FaBuilding style={styles.emptyIcon} />
                                <p style={styles.emptyText}>No hay perfiles guardados</p>
                                <p style={styles.emptySubtext}>Crea tu primer perfil empresarial</p>
                            </div>
                        ) : (
                            perfiles.map((perfil) => (
                                <div key={perfil.id} style={styles.profileCard}>
                                    <div style={styles.profileHeader}>
                                        {perfil.Logo && (
                                            <div style={styles.logoContainer}>
                                                <img
                                                    src={`data:image/jpeg;base64,${perfil.Logo}`}
                                                    alt="Logo de la empresa"
                                                    style={styles.logoImage}
                                                />
                                            </div>
                                        )}
                                        <div style={styles.profileHeaderText}>
                                            <h3 style={styles.profileName}>{perfil.NombreEmpresa}</h3>
                                            <p style={styles.profileSlogan}>"{perfil.Eslogan}"</p>
                                        </div>
                                    </div>
                                    
                                    <div style={styles.profileInfo}>
                                        <div style={styles.infoItem}>
                                            <FaMapMarkerAlt style={styles.infoIcon} />
                                            <span>{perfil.Direccion}</span>
                                        </div>
                                        <div style={styles.infoItem}>
                                            <FaEnvelope style={styles.infoIcon} />
                                            <span>{perfil.Correo}</span>
                                        </div>
                                        <div style={styles.infoItem}>
                                            <FaPhone style={styles.infoIcon} />
                                            <span>{perfil.Telefono}</span>
                                        </div>
                                    </div>
                                    
                                    <div style={styles.profileActions}>
                                        <button
                                            style={styles.editButton}
                                            onClick={() => handleEdit(perfil)}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            style={styles.deleteButton}
                                            onClick={() => handleDelete(perfil.id)}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: '#b3c9ca',
        padding: '2rem',
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    
    header: {
        textAlign: 'center',
        marginBottom: '3rem',
        color: '#000000',
    },
    
    title: {
        fontSize: '3rem',
        fontWeight: '800',
        margin: '0 0 1rem 0',
        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
    },
    
    titleIcon: {
        fontSize: '2.5rem',
    },
    
    subtitle: {
        fontSize: '1.2rem',
        opacity: 0.9,
        fontWeight: '300',
        margin: 0,
    },
    
    flexContainer: {
        display: 'flex',
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        alignItems: 'flex-start',
    },
    
    gestionPerfilContainer: {
        flex: '1 1 45%',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
    },
    
    perfilesGuardadosContainer: {
        flex: '1 1 55%',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        maxHeight: '80vh',
        overflowY: 'auto',
    },
    
    sectionHeader: {
        marginBottom: '2rem',
    },
    
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#2d3748',
        margin: '0 0 0.5rem 0',
    },
    
    sectionLine: {
        height: '3px',
        background: 'linear-gradient(90deg, #667eea, #764ba2)',
        borderRadius: '2px',
        width: '60px',
    },
    
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
    },
    
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    
    label: {
        fontWeight: '600',
        marginBottom: '0.5rem',
        color: '#4a5568',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    
    labelIcon: {
        color: '#667eea',
        fontSize: '0.9rem',
    },
    
    input: {
        padding: '0.875rem 1rem',
        fontSize: '1rem',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        backgroundColor: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontWeight: '400',
        color: '#2d3748',
    },
    
    fileInputContainer: {
        position: 'relative',
    },
    
    fileInput: {
        position: 'absolute',
        opacity: 0,
        width: '100%',
        height: '100%',
        cursor: 'pointer',
    },
    
    fileInputLabel: {
        display: 'block',
        padding: '0.875rem 1rem',
        backgroundColor: '#f7fafc',
        border: '2px dashed #cbd5e0',
        borderRadius: '12px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        color: '#4a5568',
        fontWeight: '500',
    },
    
    helperText: {
        fontSize: '0.75rem',
        color: '#718096',
        marginTop: '0.25rem',
    },
    
    buttonGroup: {
        marginTop: '2rem',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-start',
    },
    
    primaryButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '0.875rem 2rem',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    
    secondaryButton: {
        background: 'rgba(113, 128, 150, 0.1)',
        color: '#4a5568',
        padding: '0.875rem 2rem',
        fontSize: '1rem',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    
    profilesGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    
    emptyState: {
        textAlign: 'center',
        padding: '3rem 1rem',
        color: '#718096',
    },
    
    emptyIcon: {
        fontSize: '3rem',
        marginBottom: '1rem',
        opacity: 0.5,
    },
    
    emptyText: {
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: '0 0 0.5rem 0',
    },
    
    emptySubtext: {
        fontSize: '1rem',
        opacity: 0.7,
        margin: 0,
    },
    
    profileCard: {
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #f1f5f9',
        transition: 'all 0.3s ease',
    },
    
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
        gap: '1rem',
    },
    
    logoContainer: {
        width: '60px',
        height: '60px',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    
    logoImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    
    profileHeaderText: {
        flex: 1,
    },
    
    profileName: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#2d3748',
        margin: '0 0 0.25rem 0',
    },
    
    profileSlogan: {
        fontSize: '0.9rem',
        color: '#667eea',
        fontStyle: 'italic',
        margin: 0,
    },
    
    profileInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '1.5rem',
    },
    
    infoItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.9rem',
        color: '#4a5568',
    },
    
    infoIcon: {
        color: '#667eea',
        fontSize: '0.8rem',
        width: '16px',
    },
    
    profileActions: {
        display: 'flex',
        gap: '0.75rem',
        paddingTop: '1rem',
        borderTop: '1px solid #f1f5f9',
    },
    
    editButton: {
        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        color: 'white',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        flex: 1,
    },
    
    deleteButton: {
        background: 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)',
        color: 'white',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        flex: 1,
    },
};

export default Perfil;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Vision = () => {
    const [vision, setVision] = useState({
        titulo: '',
        contenido: '',
        id_empresa: '',
        estado: 'activo'
    });
    const [visiones, setVisiones] = useState([]);
    const [perfiles, setPerfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener visiones
                const visionesResponse = await axios.get('https://backendd-q0zc.onrender.com/api/vision');
                setVisiones(visionesResponse.data);

                // Obtener perfiles para el dropdown
                const perfilesResponse = await axios.get('https://backendd-q0zc.onrender.com/api/perfil');
                setPerfiles(perfilesResponse.data);
                // Establecer id_empresa predeterminado si hay perfiles
                if (perfilesResponse.data.length > 0 && !vision.id_empresa) {
                    setVision(prev => ({ ...prev, id_empresa: perfilesResponse.data[0].id }));
                }
            } catch (error) {
                console.error('Error al obtener datos:', error.message);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'titulo') {
            if (value.length <= 255) {
                setVision({
                    ...vision,
                    [name]: value
                });
            }
        } else if (name === 'contenido' || name === 'id_empresa') {
            setVision({
                ...vision,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!vision.titulo || !vision.contenido || !vision.id_empresa) {
            MySwal.fire({
                title: 'Error!',
                text: 'Por favor, llena todos los campos requeridos.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            if (editingId) {
                await axios.put(`https://backendd-q0zc.onrender.com/api/vision/${editingId}`, vision);
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'La visión ha sido actualizada correctamente y ahora está activa.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                await axios.post('https://backendd-q0zc.onrender.com/api/vision', vision);
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'La visión ha sido creada correctamente y ahora está activa.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }

            setVision({
                titulo: '',
                contenido: '',
                id_empresa: perfiles.length > 0 ? perfiles[0].id : '',
                estado: 'activo'
            });
            setEditingId(null);
            const response = await axios.get('https://backendd-q0zc.onrender.com/api/vision');
            setVisiones(response.data);
        } catch (error) {
            console.error('Error al guardar visión:', error.message);
            MySwal.fire({
                title: 'Error!',
                text: 'No se pudo guardar la visión.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await MySwal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto después de eliminarlo.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`https://backendd-q0zc.onrender.com/api/vision/${id}`);
                setVisiones(visiones.filter(v => v.id !== id));
                MySwal.fire(
                    'Eliminado!',
                    'La visión ha sido eliminada.',
                    'success'
                );
            } catch (error) {
                console.error('Error al eliminar visión:', error.message);
                MySwal.fire(
                    'Error!',
                    'Hubo un problema al intentar eliminar la visión.',
                    'error'
                );
            }
        }
    };

    const handleEdit = (vision) => {
        setVision({
            titulo: vision.titulo,
            contenido: vision.contenido,
            id_empresa: vision.id_empresa,
            estado: 'activo' // Al editar, la visión se establecerá como activa
        });
        setEditingId(vision.id);
    };

    const handleCancel = () => {
        setVision({
            titulo: '',
            contenido: '',
            id_empresa: perfiles.length > 0 ? perfiles[0].id : '',
            estado: 'activo'
        });
        setEditingId(null);
    };

    return (
        <div style={styles.container}>
            {/* Header con gradiente */}
            <div style={styles.header}>
                <h1 style={styles.title}>
                    <span style={styles.titleIcon}>✨</span>
                    Gestión de Visiones
                    <span style={styles.titleIcon}>✨</span>
                </h1>
                <p style={styles.subtitle}>Define y administra las visiones de tu empresa</p>
            </div>

            <div style={styles.mainContent}>
                {/* Panel de formulario */}
                <div style={styles.formPanel}>
                    <div style={styles.panelHeader}>
                        <h2 style={styles.panelTitle}>
                            {editingId ? '✏️ Editar Visión' : '🚀 Nueva Visión'}
                        </h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>📝</span>
                                Título
                            </label>
                            <input
                                type="text"
                                name="titulo"
                                placeholder="Ingresa el título de la visión..."
                                value={vision.titulo}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                            <span style={styles.charCount}>{vision.titulo.length}/255</span>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>📄</span>
                                Contenido
                            </label>
                            <textarea
                                name="contenido"
                                placeholder="Describe la visión de la empresa..."
                                value={vision.contenido}
                                onChange={handleChange}
                                required
                                style={styles.textarea}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>🏢</span>
                                Empresa
                            </label>
                            <select
                                name="id_empresa"
                                value={vision.id_empresa}
                                onChange={handleChange}
                                required
                                style={styles.select}
                            >
                                {perfiles.length === 0 ? (
                                    <option value="">No hay empresas disponibles</option>
                                ) : (
                                    perfiles.map(perfil => (
                                        <option key={perfil.id} value={perfil.id}>
                                            {perfil.NombreEmpresa}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div style={styles.buttonContainer}>
                            <button type="submit" style={styles.primaryButton}>
                                <span style={styles.buttonIcon}>
                                    {editingId ? '💾' : '➕'}
                                </span>
                                {editingId ? 'Actualizar Visión' : 'Crear Visión'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancel} style={styles.secondaryButton}>
                                    <span style={styles.buttonIcon}>❌</span>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Panel de visiones guardadas */}
                <div style={styles.visionesPanel}>
                    <div style={styles.panelHeader}>
                        <h2 style={styles.panelTitle}>
                            📊 Visiones Guardadas
                            <span style={styles.badge}>{visiones.length}</span>
                        </h2>
                    </div>

                    <div style={styles.visionesContainer}>
                        {visiones.length === 0 ? (
                            <div style={styles.emptyState}>
                                <div style={styles.emptyIcon}>📋</div>
                                <p style={styles.emptyText}>No hay visiones guardadas</p>
                                <p style={styles.emptySubtext}>Crea tu primera visión empresarial</p>
                            </div>
                        ) : (
                            visiones.map((visionItem) => (
                                <div key={visionItem.id} style={styles.visionCard}>
                                    <div style={styles.cardHeader}>
                                        <h3 style={styles.cardTitle}>{visionItem.titulo}</h3>
                                        <div style={styles.statusBadge}>
                                            <span style={visionItem.estado === 'activo' ? styles.activeStatus : styles.inactiveStatus}>
                                                {visionItem.estado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div style={styles.cardContent}>
                                        <p style={styles.cardText}>{visionItem.contenido}</p>
                                    </div>
                                    
                                    <div style={styles.cardMeta}>
                                        <div style={styles.metaItem}>
                                            <span style={styles.metaIcon}>🏢</span>
                                            <span style={styles.metaText}>{visionItem.NombreEmpresa}</span>
                                        </div>
                                        <div style={styles.metaItem}>
                                            <span style={styles.metaIcon}>📅</span>
                                            <span style={styles.metaText}>
                                                {new Date(visionItem.fechahora).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div style={styles.cardActions}>
                                        <button
                                            style={styles.editButton}
                                            onClick={() => handleEdit(visionItem)}
                                        >
                                            <span style={styles.buttonIcon}>✏️</span>
                                            Editar
                                        </button>
                                        <button
                                            style={styles.deleteButton}
                                            onClick={() => handleDelete(visionItem.id)}
                                        >
                                            <span style={styles.buttonIcon}>🗑️</span>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
    minHeight: '100vh',
    background: '#b3c9ca', // Changed to white
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
},
    header: {
        textAlign: 'center',
        marginBottom: '40px',
        padding: '40px 20px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    title: {
        fontSize: '3.5rem',
        fontWeight: '800',
        color: '#000000', // Changed to black
        margin: '0 0 16px 0',
        textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        letterSpacing: '-0.02em'
    },
    titleIcon: {
        margin: '0 16px',
        fontSize: '2.5rem'
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#000000', // Changed to black
        margin: 0,
        fontWeight: '400'
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    formPanel: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        height: 'fit-content'
    },
    visionesPanel: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        maxHeight: '800px',
        display: 'flex',
        flexDirection: 'column'
    },
    panelHeader: {
        marginBottom: '32px',
        paddingBottom: '16px',
        borderBottom: '2px solid #f0f4f8'
    },
    panelTitle: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#2d3748',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    badge: {
        background: 'linear-gradient(135deg, #549c94, #3d7570)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: '600',
        marginLeft: 'auto'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    inputGroup: {
        position: 'relative'
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        color: '#4a5568',
        marginBottom: '8px'
    },
    labelIcon: {
        fontSize: '1.2rem'
    },
    input: {
        width: '100%',
        padding: '16px 20px',
        fontSize: '1rem',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        background: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontFamily: 'inherit',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        padding: '16px 20px',
        fontSize: '1rem',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        background: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontFamily: 'inherit',
        minHeight: '120px',
        resize: 'vertical',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        padding: '16px 20px',
        fontSize: '1rem',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        background: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontFamily: 'inherit',
        cursor: 'pointer',
        boxSizing: 'border-box'
    },
    charCount: {
        position: 'absolute',
        bottom: '-20px',
        right: '0',
        fontSize: '0.8rem',
        color: '#a0aec0',
        fontWeight: '500'
    },
    buttonContainer: {
        display: 'flex',
        gap: '16px',
        marginTop: '32px'
    },
    primaryButton: {
        background: 'linear-gradient(135deg, #549c94, #3d7570)',
        color: 'white',
        border: 'none',
        padding: '16px 32px',
        borderRadius: '16px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 8px 24px rgba(84, 156, 148, 0.4)',
        minWidth: '180px',
        justifyContent: 'center'
    },
    secondaryButton: {
        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
        color: 'white',
        border: 'none',
        padding: '16px 32px',
        borderRadius: '16px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 8px 24px rgba(240, 147, 251, 0.4)'
    },
    buttonIcon: {
        fontSize: '1.1rem'
    },
    visionesContainer: {
        flex: 1,
        overflowY: 'auto',
        paddingRight: '8px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#a0aec0'
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '16px'
    },
    emptyText: {
        fontSize: '1.4rem',
        fontWeight: '600',
        margin: '0 0 8px 0',
        color: '#4a5568'
    },
    emptySubtext: {
        fontSize: '1rem',
        margin: 0,
        color: '#a0aec0'
    },
    visionCard: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f7fafc',
        transition: 'all 0.3s ease',
        position: 'relative'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
    },
    cardTitle: {
        fontSize: '1.3rem',
        fontWeight: '700',
        color: '#2d3748',
        margin: 0,
        flex: 1
    },
    statusBadge: {
        marginLeft: '16px'
    },
    activeStatus: {
        background: 'linear-gradient(135deg, #48bb78, #38a169)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600'
    },
    inactiveStatus: {
        background: 'linear-gradient(135deg, #f56565, #e53e3e)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600'
    },
    cardContent: {
        marginBottom: '20px'
    },
    cardText: {
        fontSize: '1rem',
        lineHeight: '1.6',
        color: '#4a5568',
        margin: 0
    },
    cardMeta: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        paddingTop: '16px',
        borderTop: '1px solid #f7fafc'
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    metaIcon: {
        fontSize: '1rem'
    },
    metaText: {
        fontSize: '0.9rem',
        color: '#718096',
        fontWeight: '500'
    },
    cardActions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
    },
    editButton: {
        background: 'linear-gradient(135deg, #549c94, #3d7570)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 4px 12px rgba(84, 156, 148, 0.3)'
    },
    deleteButton: {
        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
    }
};
export default Vision;
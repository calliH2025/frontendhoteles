import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Politica = () => {
    const [politica, setPolitica] = useState({
        titulo: '',
        contenido: '',
        id_empresa: '',
        estado: 'activo'
    });
    const [politicas, setPoliticas] = useState([]);
    const [perfiles, setPerfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener políticas
                const politicasResponse = await axios.get('https://backendd-q0zc.onrender.com/api/politica');
                setPoliticas(politicasResponse.data);

                // Obtener perfiles para el dropdown
                const perfilesResponse = await axios.get('https://backendd-q0zc.onrender.com/api/perfil');
                setPerfiles(perfilesResponse.data);
                // Establecer id_empresa predeterminado si hay perfiles
                if (perfilesResponse.data.length > 0 && !politica.id_empresa) {
                    setPolitica(prev => ({ ...prev, id_empresa: perfilesResponse.data[0].id }));
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
                setPolitica({
                    ...politica,
                    [name]: value
                });
            }
        } else if (name === 'contenido' || name === 'id_empresa') {
            setPolitica({
                ...politica,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!politica.titulo || !politica.contenido || !politica.id_empresa) {
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
                await axios.put(`https://backendd-q0zc.onrender.com/api/politica/${editingId}`, politica);
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'La política ha sido actualizada correctamente y ahora está activa.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                await axios.post('https://backendd-q0zc.onrender.com/api/politica', politica);
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'La política ha sido creada correctamente y ahora está activa.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }

            setPolitica({
                titulo: '',
                contenido: '',
                id_empresa: perfiles.length > 0 ? perfiles[0].id : '',
                estado: 'activo'
            });
            setEditingId(null);
            const response = await axios.get('https://backendd-q0zc.onrender.com/api/politica');
            setPoliticas(response.data);
        } catch (error) {
            console.error('Error al guardar política:', error.message);
            MySwal.fire({
                title: 'Error!',
                text: 'No se pudo guardar la política.',
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
                await axios.delete(`https://backendd-q0zc.onrender.com/api/politica/${id}`);
                setPoliticas(politicas.filter(p => p.id !== id));
                MySwal.fire(
                    'Eliminado!',
                    'La política ha sido eliminada.',
                    'success'
                );
            } catch (error) {
                console.error('Error al eliminar política:', error.message);
                MySwal.fire(
                    'Error!',
                    'Hubo un problema al intentar eliminar la política.',
                    'error'
                );
            }
        }
    };

    const handleEdit = (politica) => {
        setPolitica({
            titulo: politica.titulo,
            contenido: politica.contenido,
            id_empresa: politica.id_empresa,
            estado: 'activo' // Al editar, la política se establecerá como activa
        });
        setEditingId(politica.id);
    };

    const handleCancel = () => {
        setPolitica({
            titulo: '',
            contenido: '',
            id_empresa: perfiles.length > 0 ? perfiles[0].id : '',
            estado: 'activo'
        });
        setEditingId(null);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Gestión de Políticas</h1>
                <div style={styles.subtitle}>Administra las políticas de tu empresa de manera eficiente</div>
            </div>

            <div style={styles.flexContainer}>
                <section style={styles.gestionPoliticaContainer}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>
                            <span style={styles.icon}>📝</span>
                            {editingId ? 'Editar Política' : 'Nueva Política'}
                        </h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Título de la Política</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    placeholder="Ingresa el título de la política"
                                    value={politica.titulo}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                                <div style={styles.charCount}>{politica.titulo.length}/255</div>
                            </div>
                            
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Empresa</label>
                                <select
                                    name="id_empresa"
                                    value={politica.id_empresa}
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
                            
                            <div style={styles.inputGroupFull}>
                                <label style={styles.label}>Contenido de la Política</label>
                                <textarea
                                    name="contenido"
                                    placeholder="Describe el contenido completo de la política..."
                                    value={politica.contenido}
                                    onChange={handleChange}
                                    required
                                    style={styles.textarea}
                                />
                            </div>
                        </div>
                        
                        <div style={styles.buttonGroup}>
                            <button type="submit" style={styles.primaryButton}>
                                <span style={styles.buttonIcon}>
                                    {editingId ? '✏️' : '💾'}
                                </span>
                                {editingId ? 'Actualizar Política' : 'Crear Política'}
                            </button>
                            <button type="button" onClick={handleCancel} style={styles.secondaryButton}>
                                <span style={styles.buttonIcon}>❌</span>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </section>

                <section style={styles.politicasGuardadasContainer}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>
                            <span style={styles.icon}>📋</span>
                            Políticas Guardadas
                        </h2>
                        <div style={styles.badge}>{politicas.length} políticas</div>
                    </div>
                    
                    <div style={styles.politicasList}>
                        {politicas.length === 0 ? (
                            <div style={styles.emptyState}>
                                <div style={styles.emptyIcon}>📄</div>
                                <p style={styles.emptyText}>No hay políticas guardadas</p>
                                <p style={styles.emptySubtext}>Crea tu primera política usando el formulario</p>
                            </div>
                        ) : (
                            politicas.map((politica) => (
                                <div key={politica.id} style={styles.politicaCard}>
                                    <div style={styles.cardHeader}>
                                        <h3 style={styles.cardTitle}>{politica.titulo}</h3>
                                        <div style={styles.statusBadge}>
                                            <span style={styles.statusDot}></span>
                                            {politica.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                        </div>
                                    </div>
                                    
                                    <div style={styles.cardContent}>
                                        <div style={styles.contentPreview}>
                                            {politica.contenido.length > 150 
                                                ? politica.contenido.substring(0, 150) + '...' 
                                                : politica.contenido
                                            }
                                        </div>
                                        
                                        <div style={styles.cardMeta}>
                                            <div style={styles.metaItem}>
                                                <strong>Empresa:</strong> {politica.NombreEmpresa}
                                            </div>
                                            <div style={styles.metaItem}>
                                                <strong>Fecha:</strong> {new Date(politica.fechahora).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={styles.cardActions}>
                                        <button
                                            style={styles.editButton}
                                            onClick={() => handleEdit(politica)}
                                        >
                                            <span style={styles.buttonIcon}>✏️</span>
                                            Editar
                                        </button>
                                        <button
                                            style={styles.deleteButton}
                                            onClick={() => handleDelete(politica.id)}
                                        >
                                            <span style={styles.buttonIcon}>🗑️</span>
                                            Eliminar
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
    background: '#b3c9ca', // Changed to white
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
},
    header: {
        textAlign: 'center',
        marginBottom: '40px'
    },
    title: {
    fontSize: '42px',
    fontWeight: '700',
    color: '#000000', // Changed to black
    textShadow: 'none', // Removed shadow for better contrast on white background
    margin: 0,
    letterSpacing: '-0.5px'
},
    subtitle: {
        fontSize: '18px',
         color: '#000000',
        fontWeight: '400'
    },
    flexContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    gestionPoliticaContainer: {
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '24px',
        padding: '32px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
        border: '1px solid rgba(255,255,255,0.2)'
    },
    politicasGuardadasContainer: {
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '24px',
        padding: '32px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)',
        border: '1px solid rgba(255,255,255,0.2)',
        maxHeight: '800px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid #f0f4f8'
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2d3748',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    icon: {
        fontSize: '28px'
    },
    badge: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '32px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    inputGroupFull: {
        display: 'flex',
        flexDirection: 'column',
        gridColumn: 'span 2'
    },
    label: {
        fontWeight: '600',
        marginBottom: '8px',
        color: '#2d3748',
        fontSize: '16px'
    },
    input: {
        padding: '16px 20px',
        fontSize: '16px',
        borderRadius: '16px',
        border: '2px solid #e2e8f0',
        backgroundColor: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontWeight: '500',
        color: '#2d3748'
    },
    select: {
        padding: '16px 20px',
        fontSize: '16px',
        borderRadius: '16px',
        border: '2px solid #e2e8f0',
        backgroundColor: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontWeight: '500',
        color: '#2d3748',
        cursor: 'pointer'
    },
    textarea: {
        padding: '16px 20px',
        fontSize: '16px',
        borderRadius: '16px',
        border: '2px solid #e2e8f0',
        backgroundColor: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontWeight: '500',
        color: '#2d3748',
        resize: 'vertical',
        minHeight: '120px',
        fontFamily: 'inherit'
    },
    charCount: {
        fontSize: '12px',
        color: '#718096',
        textAlign: 'right',
        marginTop: '4px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'flex-start'
    },
    primaryButton: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: '#ffffff',
        padding: '16px 32px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '16px',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    secondaryButton: {
        background: '#ffffff',
        color: '#4a5568',
        padding: '16px 32px',
        fontSize: '16px',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    buttonIcon: {
        fontSize: '16px'
    },
    politicasList: {
        flex: 1,
        overflowY: 'auto',
        paddingRight: '8px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#718096'
    },
    emptyIcon: {
        fontSize: '64px',
        marginBottom: '16px'
    },
    emptyText: {
        fontSize: '18px',
        fontWeight: '600',
        margin: '0 0 8px 0',
        color: '#4a5568'
    },
    emptySubtext: {
        fontSize: '14px',
        margin: 0
    },
    politicaCard: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        border: '1px solid #f0f4f8',
        transition: 'all 0.3s ease'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
    },
    cardTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#2d3748',
        margin: 0,
        flex: 1,
        marginRight: '16px'
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: '#c6f6d5',
        color: '#22543d',
        padding: '6px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap'
    },
    statusDot: {
        width: '8px',
        height: '8px',
        backgroundColor: '#38a169',
        borderRadius: '50%'
    },
    cardContent: {
        marginBottom: '20px'
    },
    contentPreview: {
        color: '#4a5568',
        lineHeight: '1.6',
        marginBottom: '16px',
        fontSize: '15px'
    },
    cardMeta: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px'
    },
    metaItem: {
        fontSize: '14px',
        color: '#718096'
    },
    cardActions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
    },
    editButton: {
        background: 'linear-gradient(135deg, #4fd1c7, #36b89e)',
        color: '#ffffff',
        padding: '10px 20px',
        fontSize: '14px',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    deleteButton: {
        background: 'linear-gradient(135deg, #fc8181, #e53e3e)',
        color: '#ffffff',
        padding: '10px 20px',
        fontSize: '14px',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    }
};

export default Politica;
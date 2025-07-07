import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Mision = () => {
    const [mision, setMision] = useState({
        titulo: '',
        contenido: '',
        id_empresa: '',
        estado: 'activo'
    });
    const [misiones, setMisiones] = useState([]);
    const [perfiles, setPerfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener misiones
                const misionesResponse = await axios.get('https://backendd-q0zc.onrender.com/api/mision');
                setMisiones(misionesResponse.data);

                // Obtener perfiles para el dropdown
                const perfilesResponse = await axios.get('https://backendd-q0zc.onrender.com/api/perfil');
                setPerfiles(perfilesResponse.data);
                // Establecer id_empresa predeterminado si hay perfiles
                if (perfilesResponse.data.length > 0 && !mision.id_empresa) {
                    setMision(prev => ({ ...prev, id_empresa: perfilesResponse.data[0].id }));
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
                setMision({
                    ...mision,
                    [name]: value
                });
            }
        } else if (name === 'contenido' || name === 'id_empresa') {
            setMision({
                ...mision,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mision.titulo || !mision.contenido || !mision.id_empresa) {
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
                await axios.put(`https://backendd-q0zc.onrender.com/api/mision/${editingId}`, mision);
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'La misión ha sido actualizada correctamente y ahora está activa.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                await axios.post('https://backendd-q0zc.onrender.com/api/mision', mision);
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'La misión ha sido creada correctamente y ahora está activa.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }

            setMision({
                titulo: '',
                contenido: '',
                id_empresa: perfiles.length > 0 ? perfiles[0].id : '',
                estado: 'activo'
            });
            setEditingId(null);
            const response = await axios.get('https://backendd-q0zc.onrender.com/api/mision');
            setMisiones(response.data);
        } catch (error) {
            console.error('Error al guardar misión:', error.message);
            MySwal.fire({
                title: 'Error!',
                text: 'No se pudo guardar la misión.',
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
                await axios.delete(`https://backendd-q0zc.onrender.com/api/mision/${id}`);
                setMisiones(misiones.filter(m => m.id !== id));
                MySwal.fire(
                    'Eliminado!',
                    'La misión ha sido eliminada.',
                    'success'
                );
            } catch (error) {
                console.error('Error al eliminar misión:', error.message);
                MySwal.fire(
                    'Error!',
                    'Hubo un problema al intentar eliminar la misión.',
                    'error'
                );
            }
        }
    };

    const handleEdit = (mision) => {
        setMision({
            titulo: mision.titulo,
            contenido: mision.contenido,
            id_empresa: mision.id_empresa,
            estado: 'activo' // Al editar, la misión se establecerá como activa
        });
        setEditingId(mision.id);
    };

    const handleCancel = () => {
        setMision({
            titulo: '',
            contenido: '',
            id_empresa: perfiles.length > 0 ? perfiles[0].id : '',
            estado: 'activo'
        });
        setEditingId(null);
    };

    return (
        <div style={styles.container}>
            {/* Header Principal */}
            <div style={styles.mainHeader}>
                <div style={styles.headerContent}>
                    <h1 style={styles.mainTitle}>Gestión de Misiones</h1>
                    <p style={styles.subtitle}>Administra las misiones de tu empresa de manera eficiente</p>
                </div>
                <div style={styles.headerDecoration}></div>
            </div>

            <div style={styles.content}>
                <div style={styles.flexContainer}>
                    {/* Sección de Gestión */}
                    <div style={styles.formSection}>
                        <div style={styles.sectionHeader}>
                            <div style={styles.sectionIcon}>✏️</div>
                            <h2 style={styles.sectionTitle}>
                                {editingId ? 'Editar Misión' : 'Nueva Misión'}
                            </h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Título de la Misión</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    placeholder="Ingresa el título de la misión..."
                                    value={mision.titulo}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                                <div style={styles.charCounter}>
                                    {mision.titulo.length}/255 caracteres
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Descripción</label>
                                <textarea
                                    name="contenido"
                                    placeholder="Describe detalladamente la misión..."
                                    value={mision.contenido}
                                    onChange={handleChange}
                                    required
                                    style={styles.textarea}
                                    rows="4"
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Empresa</label>
                                <select
                                    name="id_empresa"
                                    value={mision.id_empresa}
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

                            <div style={styles.buttonGroup}>
                                <button type="submit" style={styles.primaryButton}>
                                    <span style={styles.buttonIcon}>
                                        {editingId ? '✓' : '+'}
                                    </span>
                                    {editingId ? 'Actualizar Misión' : 'Crear Misión'}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={handleCancel} style={styles.secondaryButton}>
                                        <span style={styles.buttonIcon}>✕</span>
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Sección de Misiones Guardadas */}
                    <div style={styles.listSection}>
                        <div style={styles.sectionHeader}>
                            <div style={styles.sectionIcon}>📋</div>
                            <h2 style={styles.sectionTitle}>Misiones Registradas</h2>
                            <div style={styles.badge}>{misiones.length}</div>
                        </div>

                        <div style={styles.listContainer}>
                            {misiones.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <div style={styles.emptyIcon}>📝</div>
                                    <p style={styles.emptyText}>No hay misiones registradas</p>
                                    <p style={styles.emptySubtext}>Crea tu primera misión usando el formulario</p>
                                </div>
                            ) : (
                                misiones.map((mision) => (
                                    <div key={mision.id} style={styles.misionCard}>
                                        <div style={styles.cardHeader}>
                                            <h3 style={styles.cardTitle}>{mision.titulo}</h3>
                                            <div style={styles.statusBadge}>
                                                <span style={styles.statusDot}></span>
                                                {mision.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                            </div>
                                        </div>
                                        
                                        <p style={styles.cardContent}>{mision.contenido}</p>
                                        
                                        <div style={styles.cardMeta}>
                                            <div style={styles.metaItem}>
                                                <span style={styles.metaLabel}>Empresa:</span>
                                                <span style={styles.metaValue}>{mision.NombreEmpresa}</span>
                                            </div>
                                            <div style={styles.metaItem}>
                                                <span style={styles.metaLabel}>Fecha:</span>
                                                <span style={styles.metaValue}>
                                                    {new Date(mision.fechahora).toLocaleDateString('es-ES', {
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
                                                onClick={() => handleEdit(mision)}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                style={styles.deleteButton}
                                                onClick={() => handleDelete(mision.id)}
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: '#b3c9ca',
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px'
    },
    mainHeader: {
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        marginBottom: '30px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    },
    headerContent: {
        position: 'relative',
        zIndex: 2
    },
    mainTitle: {
        fontSize: '3rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        margin: '0 0 10px 0',
        letterSpacing: '-0.02em'
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#64748b',
        margin: 0,
        fontWeight: '400'
    },
    headerDecoration: {
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        borderRadius: '50%',
        zIndex: 1
    },
    content: {
        maxWidth: '1400px',
        margin: '0 auto'
    },
    flexContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        alignItems: 'start'
    },
    formSection: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '0',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    listSection: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '0',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxHeight: '800px',
        display: 'flex',
        flexDirection: 'column'
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '30px 30px 20px 30px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
    },
    sectionIcon: {
        fontSize: '1.5rem',
        padding: '8px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0,
        flex: 1
    },
    badge: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.875rem',
        fontWeight: '600'
    },
    form: {
        padding: '0 30px 30px 30px'
    },
    inputGroup: {
        marginBottom: '25px'
    },
    label: {
        display: 'block',
        fontSize: '0.95rem',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '8px',
        letterSpacing: '0.01em'
    },
    input: {
        width: '100%',
        padding: '14px 18px',
        fontSize: '1rem',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        background: '#fafafa',
        color: '#1f2937',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontFamily: 'inherit',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        padding: '14px 18px',
        fontSize: '1rem',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        background: '#fafafa',
        color: '#1f2937',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontFamily: 'inherit',
        resize: 'vertical',
        minHeight: '100px',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        padding: '14px 18px',
        fontSize: '1rem',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        background: '#fafafa',
        color: '#1f2937',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontFamily: 'inherit',
        cursor: 'pointer',
        boxSizing: 'border-box'
    },
    charCounter: {
        fontSize: '0.8rem',
        color: '#9ca3af',
        textAlign: 'right',
        marginTop: '5px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '15px',
        marginTop: '30px'
    },
    primaryButton: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        padding: '14px 28px',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
        fontFamily: 'inherit'
    },
    secondaryButton: {
        background: '#f8fafc',
        color: '#64748b',
        border: '2px solid #e2e8f0',
        padding: '14px 28px',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit'
    },
    buttonIcon: {
        fontSize: '1rem'
    },
    listContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 30px 30px 30px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#64748b'
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '20px',
        opacity: 0.5
    },
    emptyText: {
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: '0 0 10px 0'
    },
    emptySubtext: {
        fontSize: '1rem',
        margin: 0,
        opacity: 0.7
    },
    misionCard: {
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        position: 'relative'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px',
        gap: '15px'
    },
    cardTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0,
        lineHeight: '1.4',
        flex: 1
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        background: '#dcfce7',
        color: '#166534',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        whiteSpace: 'nowrap'
    },
    statusDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#22c55e'
    },
    cardContent: {
        fontSize: '1rem',
        color: '#4b5563',
        lineHeight: '1.6',
        marginBottom: '20px',
        margin: '0 0 20px 0'
    },
    cardMeta: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '20px',
        padding: '15px',
        background: '#f8fafc',
        borderRadius: '12px'
    },
    metaItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    metaLabel: {
        fontSize: '0.8rem',
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    metaValue: {
        fontSize: '0.95rem',
        color: '#1e293b',
        fontWeight: '500'
    },
    cardActions: {
        display: 'flex',
        gap: '12px'
    },
    editButton: {
        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'inherit'
    },
    deleteButton: {
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'inherit'
    }
};

export default Mision;
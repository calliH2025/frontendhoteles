import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Terminos = () => {
    const [termino, setTermino] = useState({
        titulo: '',
        contenido: '',
        id_empresa: '',
        estado: 'activo'
    });
    const [terminos, setTerminos] = useState([]);
    const [perfiles, setPerfiles] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener términos
                const terminosResponse = await axios.get('https://backendreservas-m2zp.onrender.com/api/terminos');
                setTerminos(terminosResponse.data);

                // Obtener perfiles para el dropdown
                const perfilesResponse = await axios.get('https://backendreservas-m2zp.onrender.com/api/perfil');
                setPerfiles(perfilesResponse.data);
                // Establecer id_empresa predeterminado si hay perfiles
                if (perfilesResponse.data.length > 0 && !termino.id_empresa) {
                    setTermino(prev => ({ ...prev, id_empresa: perfilesResponse.data[0].id }));
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
                setTermino({
                    ...termino,
                    [name]: value
                });
            }
        } else if (name === 'contenido' || name === 'id_empresa') {
            setTermino({
                ...termino,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!termino.titulo || !termino.contenido || !termino.id_empresa) {
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
                await axios.put(`https://backendreservas-m2zp.onrender.com/api/terminos/${editingId}`, termino);
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'El término ha sido actualizado correctamente y ahora está activo.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                await axios.post(`https://backendreservas-m2zp.onrender.com/api/terminos`, termino);
                MySwal.fire({
                    title: 'Éxito!',
                    text: 'El término ha sido creado correctamente y ahora está activo.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }

            setTermino({
                titulo: '',
                contenido: '',
                id_empresa: perfiles.length > 0 ? perfiles[0].id : '',
                estado: 'activo'
            });
            setEditingId(null);
            const response = await axios.get('https://backendreservas-m2zp.onrender.com/api/terminos');
            setTerminos(response.data);
        } catch (error) {
            console.error('Error al guardar término:', error.message);
            MySwal.fire({
                title: 'Error!',
                text: 'No se pudo guardar el término.',
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
                await axios.delete(`https://backendreservas-m2zp.onrender.com/api/terminos/${id}`);
                setTerminos(terminos.filter(t => t.id !== id));
                MySwal.fire(
                    'Eliminado!',
                    'El término ha sido eliminado.',
                    'success'
                );
            } catch (error) {
                console.error('Error al eliminar término:', error.message);
                MySwal.fire(
                    'Error!',
                    'Hubo un problema al intentar eliminar el término.',
                    'error'
                );
            }
        }
    };

    const handleEdit = (termino) => {
        setTermino({
            titulo: termino.titulo,
            contenido: termino.contenido,
            id_empresa: termino.id_empresa,
            estado: 'activo' // Al editar, el término se establecerá como activo
        });
        setEditingId(termino.id);
    };

    const handleCancel = () => {
        setTermino({
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
                <h1 style={styles.title}>Gestión de Términos</h1>
                <div style={styles.titleUnderline}></div>
            </div>

            <div style={styles.flexContainer}>
                <section style={styles.gestionTerminosContainer}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>
                            {editingId ? '✏️ Editar Término' : '📝 Nuevo Término'}
                        </h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>📄 Título</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    placeholder="Ingresa el título del término..."
                                    value={termino.titulo}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                                <small style={styles.charCount}>
                                    {termino.titulo.length}/255 caracteres
                                </small>
                            </div>
                            
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>📝 Contenido</label>
                                <textarea
                                    name="contenido"
                                    placeholder="Describe el contenido del término (usa saltos de línea para separar puntos)..."
                                    value={termino.contenido}
                                    onChange={handleChange}
                                    required
                                    style={styles.textarea}
                                />
                            </div>
                            
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>🏢 Empresa</label>
                                <select
                                    name="id_empresa"
                                    value={termino.id_empresa}
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
                        </div>
                        
                        <div style={styles.buttonGroup}>
                            <button type="submit" style={styles.primaryButton}>
                                {editingId ? '✅ Actualizar Término' : '➕ Crear Término'}
                            </button>
                            <button type="button" onClick={handleCancel} style={styles.secondaryButton}>
                                ❌ Cancelar
                            </button>
                        </div>
                    </form>
                </section>

                <section style={styles.terminosGuardadosContainer}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>📚 Términos Guardados</h2>
                        <div style={styles.badge}>{terminos.length} término{terminos.length !== 1 ? 's' : ''}</div>
                    </div>
                    
                    <div style={styles.terminosGrid}>
                        {terminos.length === 0 ? (
                            <div style={styles.emptyState}>
                                <div style={styles.emptyIcon}>📝</div>
                                <p style={styles.emptyText}>No hay términos guardados</p>
                                <p style={styles.emptySubtext}>Crea tu primer término usando el formulario</p>
                            </div>
                        ) : (
                            terminos.map((termino) => (
                                <div key={termino.id} style={styles.terminoCard}>
                                    <div style={styles.cardHeader}>
                                        <h3 style={styles.terminoTitle}>{termino.titulo}</h3>
                                        <div style={styles.statusBadge}>
                                            <span style={termino.estado === 'activo' ? styles.activeStatus : styles.inactiveStatus}>
                                                {termino.estado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div style={styles.cardContent}>
                                        <ul style={styles.contentList}>
                                            {termino.contenido.split('\n').map((item, index) => (
                                                item.trim() && (
                                                    <li key={index} style={styles.contentItem}>
                                                        {item.trim()}
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div style={styles.cardFooter}>
                                        <div style={styles.metaInfo}>
                                            <span style={styles.metaItem}>
                                                🏢 {termino.NombreEmpresa}
                                            </span>
                                            <span style={styles.metaItem}>
                                                📅 {new Date(termino.fechahora).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        
                                        <div style={styles.cardActions}>
                                            <button
                                                style={styles.editButton}
                                                onClick={() => handleEdit(termino)}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                style={styles.deleteButton}
                                                onClick={() => handleDelete(termino.id)}
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
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
    titleUnderline: {
        width: '80px',
        height: '4px',
        background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
        margin: '15px auto',
        borderRadius: '2px'
    },
    flexContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    gestionTerminosContainer: {
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
    },
    terminosGuardadosContainer: {
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        maxHeight: '800px',
        overflowY: 'auto'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: '2px solid #f0f0f0'
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#333',
        margin: 0
    },
    badge: {
        background: 'linear-gradient(45deg, #667eea, #764ba2)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    formGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '25px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '8px'
    },
    input: {
        padding: '15px 20px',
        fontSize: '16px',
        borderRadius: '12px',
        border: '2px solid #e1e5e9',
        backgroundColor: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontWeight: '400',
        color: '#333'
    },
    textarea: {
        padding: '15px 20px',
        fontSize: '16px',
        borderRadius: '12px',
        border: '2px solid #e1e5e9',
        backgroundColor: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontWeight: '400',
        color: '#333',
        minHeight: '120px',
        resize: 'vertical',
        fontFamily: 'inherit'
    },
    select: {
        padding: '15px 20px',
        fontSize: '16px',
        borderRadius: '12px',
        border: '2px solid #e1e5e9',
        backgroundColor: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontWeight: '400',
        color: '#333',
        cursor: 'pointer'
    },
    charCount: {
        color: '#666',
        fontSize: '12px',
        marginTop: '5px',
        textAlign: 'right'
    },
    buttonGroup: {
        marginTop: '30px',
        display: 'flex',
        gap: '15px'
    },
    primaryButton: {
        background: 'linear-gradient(45deg, #4CAF50, #45a049)',
        color: '#ffffff',
        padding: '15px 30px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: '0 6px 20px rgba(76, 175, 80, 0.3)',
        transition: 'all 0.3s ease',
        flex: 1
    },
    secondaryButton: {
        background: 'linear-gradient(45deg, #6c757d, #5a6268)',
        color: '#ffffff',
        padding: '15px 30px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: '0 6px 20px rgba(108, 117, 125, 0.3)',
        transition: 'all 0.3s ease',
        flex: 1
    },
    terminosGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    terminoCard: {
        background: '#ffffff',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s ease'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px'
    },
    terminoTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#333',
        margin: 0,
        flex: 1
    },
    statusBadge: {
        marginLeft: '15px'
    },
    activeStatus: {
        color: '#4CAF50',
        fontSize: '14px',
        fontWeight: '600'
    },
    inactiveStatus: {
        color: '#f44336',
        fontSize: '14px',
        fontWeight: '600'
    },
    cardContent: {
        marginBottom: '20px'
    },
    contentList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0
    },
    contentItem: {
        padding: '8px 0',
        color: '#555',
        fontSize: '15px',
        lineHeight: '1.5',
        borderBottom: '1px solid #f9f9f9',
        position: 'relative',
        paddingLeft: '20px'
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #f0f0f0'
    },
    metaInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    metaItem: {
        fontSize: '13px',
        color: '#666',
        fontWeight: '500'
    },
    cardActions: {
        display: 'flex',
        gap: '10px'
    },
    editButton: {
        background: 'linear-gradient(45deg, #2196F3, #1976D2)',
        color: '#ffffff',
        padding: '10px 20px',
        fontSize: '14px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
        transition: 'all 0.3s ease'
    },
    deleteButton: {
        background: 'linear-gradient(45deg, #f44336, #d32f2f)',
        color: '#ffffff',
        padding: '10px 20px',
        fontSize: '14px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)',
        transition: 'all 0.3s ease'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666'
    },
    emptyIcon: {
        fontSize: '64px',
        marginBottom: '20px'
    },
    emptyText: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '10px',
        color: '#333'
    },
    emptySubtext: {
        fontSize: '14px',
        color: '#666'
    }
};

export default Terminos;
import React, { useState, useRef, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const FormularioCamera = () => {
    const [nome, setNome] = useState('');
    const [cidade, setCidade] = useState('');
    const [idade, setIdade] = useState('');
    const [stream, setStream] = useState(null);
    const [fotoCapturada, setFotoCapturada] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const iniciarCamera = useCallback(async () => {
        setFotoCapturada(null); // Limpa a foto anterior ao iniciar a câmera
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Erro ao acessar a câmera: ", err);
            alert("Não foi possível acessar a câmera. Verifique as permissões.");
        }
    }, [stream]);

    const pararCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const tirarFoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const imageDataURL = canvasRef.current.toDataURL('image/png');
            setFotoCapturada(imageDataURL);
            pararCamera(); // Para a câmera após tirar a foto
        }
    }, [pararCamera]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você pode fazer algo com os dados do formulário e a foto
        console.log({ nome, cidade, idade, fotoCapturada });
        alert('Formulário enviado! Verifique o console para os dados.');
        // Você pode resetar o formulário aqui se desejar
        // setNome('');
        // setCidade('');
        // setIdade('');
        // setFotoCapturada(null);
    };

    return (
        <div style={styles.container}>
            <ToastContainer />
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="nome" style={styles.label}>Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="cidade" style={styles.label}>Cidade:</label>
                    <input
                        type="text"
                        id="cidade"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="idade" style={styles.label}>Idade:</label>
                    <input
                        type="number"
                        id="idade"
                        value={idade}
                        onChange={(e) => {
                            if (e.target.value < 0) {
                                toast.warn("Idade não pode ser negativa.");
                                return;
                            }
                            if (e.target.value > 120) {
                                toast.warn("Idade não pode ser maior que 120.");
                                return;
                            }
                            setIdade(e.target.value)
                        }}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.cameraSection}>
                    {!stream && !fotoCapturada && (
                        <button type="button" onClick={iniciarCamera} style={styles.cameraButton}>
                            Abrir Câmera
                        </button>
                    )}

                    {stream && (
                        <>
                            <video ref={videoRef} autoPlay playsInline style={styles.videoPlayer}></video>
                            <button type="button" onClick={tirarFoto} style={styles.captureButton}>
                                Tirar Foto
                            </button>
                        </>
                    )}

                    {fotoCapturada && (
                        <div style={styles.photoPreview}>
                            <h3>Foto Capturada:</h3>
                            <img src={fotoCapturada} alt="Foto Capturada" style={styles.capturedImage} />
                            <button type="button" onClick={iniciarCamera} style={styles.retakeButton}>
                                Tirar Outra Foto
                            </button>
                        </div>
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                </div>

                <button type="submit" style={styles.submitButton}>
                    Cadastrar
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        color: '#333',
        marginBottom: '30px',
        fontSize: '2.5em',
        fontWeight: 'bold',
    },
    form: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '8px',
        fontSize: '1.1em',
        color: '#555',
        fontWeight: '600',
    },
    input: {
        padding: '12px 15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '1em',
        transition: 'border-color 0.3s ease-in-out',
        '&:focus': {
            borderColor: '#007bff',
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.25)',
        },
    },
    cameraSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
        marginTop: '20px',
        borderTop: '1px solid #eee',
        paddingTop: '20px',
    },
    cameraButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '1.1em',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out, transform 0.2s ease',
        '&:hover': {
            backgroundColor: '#218838',
            transform: 'translateY(-2px)',
        },
        '&:active': {
            transform: 'translateY(0)',
        },
    },
    videoPlayer: {
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#000',
    },
    captureButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '1.1em',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out, transform 0.2s ease',
        '&:hover': {
            backgroundColor: '#0056b3',
            transform: 'translateY(-2px)',
        },
        '&:active': {
            transform: 'translateY(0)',
        },
    },
    photoPreview: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        marginTop: '15px',
    },
    capturedImage: {
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        border: '2px solid #007bff',
    },
    retakeButton: {
        backgroundColor: '#ffc107',
        color: '#333',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '1em',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out, transform 0.2s ease',
        '&:hover': {
            backgroundColor: '#e0a800',
            transform: 'translateY(-2px)',
        },
        '&:active': {
            transform: 'translateY(0)',
        },
    },
    submitButton: {
        backgroundColor: '#6f42c1', // Um roxo vibrante
        color: 'white',
        padding: '15px 30px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '1.2em',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '25px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease-in-out, transform 0.2s ease',
        '&:hover': {
            backgroundColor: '#5a359b',
            transform: 'translateY(-2px)',
        },
        '&:active': {
            transform: 'translateY(0)',
        },
    },
};

export default FormularioCamera;
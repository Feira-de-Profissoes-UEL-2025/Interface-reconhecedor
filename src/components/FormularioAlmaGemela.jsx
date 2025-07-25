import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
//import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// Removido: import 'react-toastify/dist/ReactToastify.css';

import styles from './styles.module.css'
import BuscarAlmaGemea from './BuscarAlmaGemea';
import BuscarGemeo from './BuscarGemeo';

const FormularioCamera = () => {
    const [nome, setNome] = useState('');
    const [cidade, setCidade] = useState('');
    const [idade, setIdade] = useState('');
    const [stream, setStream] = useState(null);
    const [fotoCapturada, setFotoCapturada] = useState(null);
    const [cadastrado, setCadastrado] = useState(false);
    const [urlImagemCloud, setUrlImagemCloud] = useState(null);
    //const [nomeImagem, setNomeImagem] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    //procurar pessoa
    const [mostrarFormularioAlma, setMostrarFormularioAlma] = useState(false);
    //procurar Gemeo
    const [mostrarFormularioGemeo, setMostrarFormularioGemeo] = useState(false);

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://cdn.jsdelivr.net/npm/react-toastify@11.0.5/dist/ReactToastify.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Cleanup: remover o link quando o componente for desmontado
        return () => {
            document.head.removeChild(link);
        };
    }, []); // Array de dependências vazio para rodar apenas uma vez

    // useEffect para garantir que o vídeo comece a tocar assim que o stream for carregado
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            // Adiciona um listener para garantir que o vídeo comece a tocar quando os metadados estiverem carregados
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play().catch(err => {
                    console.error("Erro ao iniciar reprodução do vídeo:", err);
                    toast.error("Não foi possível iniciar a reprodução da câmara. Tente novamente.");
                });
            };
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);


    const iniciarCamera = useCallback(async () => {
        setFotoCapturada(null);

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);

        } catch (err) {
            console.error("Erro ao aceder à câmara: ", err);
            toast.error("Não foi possível aceder à câmara. Verifique as permissões do navegador.");
        }
    }, [stream]);

    const pararCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const tirarFoto = useCallback(async () => {
        if (videoRef.current && canvasRef.current) {
            // ... (código para desenhar a imagem no canvas é o mesmo)
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const imageDataURL = canvasRef.current.toDataURL('image/png');
            setFotoCapturada(imageDataURL);
            pararCamera();
        }
    }, [pararCamera]);

    const handleSubmit = async (e) => {
        e.preventDefault();


        // Converte a imagem de base64 para um Blob (que a SDK v3 entende)
        //const response = await fetch(fotoCapturada);
        //const arrayBuffer = await response.arrayBuffer();

        const fileName = `${nome || 'sem-nome'}-${Math.random(1) * 200}.png`;
        //setNomeImagem(fileName);

        // Configura os parâmetros para o upload
        // const uploadParams = {
        //     Bucket: 'bucketfeiraprofissoes',
        //     Key: fileName,
        //     Body: arrayBuffer,
        //     ContentType: 'image/png'
        // };
        let urlImagemCloudL = null;
        try {
            // Envia o comando de upload
            urlImagemCloudL = await uploadImageCloudinary();
            toast.success("Foto enviada com sucesso para o cloudinary!");
        } catch (error) {
            console.error("Erro ao fazer upload da foto:", error);
            toast.error("Erro ao fazer upload da foto. Verifique o console.");
        }

        setCadastrado(true);
        setNome('');
        setCidade('');
        setIdade('');
        setFotoCapturada(null);
        setStream(null);
        if (videoRef.current) {
            videoRef.current.srcObject = null; // Limpa o stream do vídeo
        }

        await fetch('http://localhost:8000/formulario', // Use a relative URL if using a proxy
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    cidade: cidade,
                    idade: parseInt(idade, 10),
                    bucket_image_url: urlImagemCloudL,
                })
            }
        ).then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar os dados do formulário');
            }
            return response.json();
        }
        ).then(data => {
            console.log('Dados enviados com sucesso:', data);
            toast.success("Dados enviados com sucesso!");
        }).catch(error => {
            console.error('Erro ao enviar os dados do formulário:', error);
            toast.error("Erro ao enviar os dados do formulário. Verifique o console.");
        });
    };

    const uploadImageCloudinary = async () => {
        const formData = new FormData();
        formData.append('file', fotoCapturada);
        formData.append('upload_preset', "feiraProfissoes");

        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/duzxjunpz/image/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json();

            setUrlImagemCloud(data.secure_url);
            console.log(data)
            return data.secure_url; // Retorna o ID público da imagem
        } catch (e) {
            console.error("Erro ao fazer upload da imagem:", e);
            toast.error("Erro ao fazer upload da imagem. Verifique o console.");
        }
    }

    return (
        <div className={styles.container}>
            <ToastContainer />

            {mostrarFormularioAlma ? (
                <BuscarAlmaGemea onVoltar={() => setMostrarFormularioAlma(false)} />
            ) : mostrarFormularioGemeo ? (
                <BuscarGemeo onVoltar={() => setMostrarFormularioGemeo(false)} />
            ) : !cadastrado ? (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.title}>Cadastro de Utilizador</h2>

                    <div className={styles.inputGroup}>
                        <label htmlFor="nome" className={styles.label}>Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="cidade" className={styles.label}>Cidade:</label>
                        <input
                            type="text"
                            id="cidade"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="idade" className={styles.label}>Idade:</label>
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
                                setIdade(e.target.value);
                            }}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.cameraSection}>
                        {!stream && !fotoCapturada && (
                            <button type="button" onClick={iniciarCamera} className={styles.cameraButton}>
                                Abrir Câmera
                            </button>
                        )}

                        {stream && (
                            <>
                                <video ref={videoRef} autoPlay playsInline className={styles.videoPlayer}></video>
                                <button type="button" onClick={tirarFoto} className={styles.captureButton}>
                                    Tirar Foto
                                </button>
                            </>
                        )}

                        {fotoCapturada && (
                            <div className={styles.photoPreview}>
                                <h3>Foto Capturada:</h3>
                                <img src={fotoCapturada} alt="Foto Capturada" className={styles.capturedImage} />
                                <button type="button" onClick={iniciarCamera} className={styles.retakeButton}>
                                    Tirar Outra Foto
                                </button>
                            </div>
                        )}

                        <canvas ref={canvasRef} className={{ display: 'none' }}></canvas>
                    </div>

                    <button type="submit" className={styles.submitButton} onClick={(e) => {
                        setCadastrado(true);
                        handleSubmit(e);
                    }}>
                        Registar
                    </button>
                </form>
            ) : (
                <div className={styles.container}>
                    <h2 className={styles.title}>Registo Realizado!</h2>
                    <button className={styles.submitButton} onClick={() => setMostrarFormularioAlma(true)}>
                        Encontrar alma gémea
                    </button>
                    <button className={styles.submitButton} onClick={() => setMostrarFormularioGemeo(true)}>
                        Encontrar gémeo
                    </button>
                    <button className={styles.submitButton} onClick={() => setCadastrado(false)}>Voltar</button>

                </div>
            )}
        </div>
    );


};

export default FormularioCamera;
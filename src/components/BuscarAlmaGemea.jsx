import React, { useState } from 'react';
import { toast } from 'react-toastify';

import styles from './styles.module.css';

const BuscarAlmaGemea = ({ onVoltar }) => {
    const [cidadeDesejada, setCidadeDesejada] = useState('');
    const [idadeDesejada, setIdadeDesejada] = useState('');
    const [imagemResultado, setImagemResultado] = useState(null);
    const [corCabelo, setCorCabelo] = useState('');
    const [skinTone, setSkinTone] = useState('');
    const [genero, setGenero] = useState('');
    const [temBarba, setTemBarba] = useState(false);
    const [usaOculos, setUsaOculos] = useState(false);

    // 🔎 Função que envia os parâmetros e busca a imagem do "alma gémea"
    const handleBuscar = async () => {
        if (!cidadeDesejada || !idadeDesejada) {
            toast.warn("Preencha todos os campos para buscar.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/buscar-alma-gemea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cidade: cidadeDesejada,
                    idade: parseInt(idadeDesejada),
                    cor_cabelo: corCabelo,
                    tonalidade_pele: skinTone,
                    genero: genero,
                    tem_barba: temBarba,
                    usa_oculos: usaOculos
                })
            });

            const data = await response.json();

            if (data && data.imagem_url) {
                setImagemResultado(data.imagem_url);
                toast.success("Alma gémea encontrada!");
            } else {
                toast.info("Nenhuma alma gémea encontrada.");
                setImagemResultado(null);
            }
        } catch (error) {
            console.error("Erro ao buscar alma gémea:", error);
            toast.error("Erro ao buscar alma gémea.");
        }
    };

    return (
        <div className={styles.form}>
            <h2 className={styles.title}>Buscar Alma Gémea</h2>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Cidade desejada:</label>
                <input
                    type="text"
                    value={cidadeDesejada}
                    onChange={(e) => setCidadeDesejada(e.target.value)}
                    className={styles.input}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Idade desejada:</label>
                <input
                    type="number"
                    value={idadeDesejada}
                    onChange={(e) => setIdadeDesejada(e.target.value)}
                    className={styles.input}
                />
            </div>
            <div className={styles.inputGroup}>
                <label className={styles.label}>Cor do cabelo:</label>
                <select
                    value={corCabelo}
                    onChange={(e) => setCorCabelo(e.target.value)}
                    className={styles.input}
                >
                    <option value="">Selecione</option>
                    <option value="preto">Preto</option>
                    <option value="castanho">Castanho</option>
                    <option value="loiro">Loiro</option>
                    <option value="ruivo">Ruivo</option>
                    <option value="grisalho">Grisalho</option>
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Tonalidade da pele:</label>
                <select
                    value={skinTone}
                    onChange={(e) => setSkinTone(e.target.value)}
                    className={styles.input}
                >
                    <option value="">Selecione</option>
                    <option value="clara">Clara</option>
                    <option value="média">Média</option>
                    <option value="escura">Escura</option>
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Gênero:</label>
                <select
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    className={styles.input}
                >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>
                    <input
                        type="checkbox"
                        checked={temBarba}
                        onChange={(e) => setTemBarba(e.target.checked)}
                    />
                    Tem barba?
                </label>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>
                    <input
                        type="checkbox"
                        checked={usaOculos}
                        onChange={(e) => setUsaOculos(e.target.checked)}
                    />
                    Usa óculos?
                </label>
            </div>


            <button onClick={handleBuscar} className={styles.submitButton}>
                Buscar
            </button>

            <button onClick={onVoltar} className={styles.retakeButton}>
                Voltar
            </button>

            {imagemResultado && (
                <div className={styles.photoPreview}>
                    <h3>Resultado encontrado:</h3>
                    <img src={imagemResultado} alt="Alma gémea" className={styles.capturedImage} />
                </div>
            )}
        </div>
    );
};

export default BuscarAlmaGemea;

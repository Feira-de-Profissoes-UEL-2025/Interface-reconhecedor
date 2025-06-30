import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './styles.module.css';

const BuscarGemeo = ({ onVoltar }) => {
    const [resultados, setResultados] = useState([]);

    useEffect(() => {
        const buscar = async () => {
            try {
                const response = await fetch('http://localhost:8000/buscar-gemeo');
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    setResultados(data);
                    toast.success("Resultados encontrados!");
                } else {
                    toast.info("Nenhum gémeo encontrado.");
                }
            } catch (error) {
                console.error("Erro ao buscar gémeos:", error);
                toast.error("Erro ao buscar gémeos.");
            }
        };

        buscar();
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Pessoas Parecidas com Você</h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {resultados.map((pessoa, index) => (
                    <div key={index} style={{ textAlign: 'center', width: '300px' }}>
                        <img src={pessoa.imagem_url} alt={`Gêmeo ${index + 1}`} className={styles.capturedImage} />
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px', textAlign: 'left' }}>
                            <li><strong>Nome:</strong> {pessoa.nome}</li>
                            <li><strong>Cidade:</strong> {pessoa.cidade}</li>
                            <li><strong>Idade:</strong> {pessoa.idade_real || 'Desconhecida'}</li>
                            <li><strong>Óculos:</strong> {pessoa.usa_oculos ? 'Sim' : 'Não'}</li>
                            <li><strong>Cor do Cabelo:</strong> {pessoa.cor_cabelo || 'Desconhecida'}</li>
                            <li><strong>Cor da Pele (Skin tone):</strong> {pessoa.tonalidade_pele || 'Desconhecida'}</li>
                            <li><strong>Gênero:</strong> {pessoa.genero || 'Desconhecido'}</li>
                            <li><strong>Barba:</strong> {pessoa.barba || 'Desconhecido'}</li>
                            <li><strong>Formato do Rosto:</strong> {pessoa.formato_rosto || 'Desconhecido'}</li>
                            <li><strong>Cor dos Olhos:</strong> {pessoa.cor_olhos || 'Desconhecida'}</li>
                            <li><strong>Corte de Cabelo:</strong> {pessoa.corte_cabelo || 'Desconhecido'}</li>
                            <li><strong>Sorriso:</strong> {pessoa.sorriso || 'Desconhecido'}</li>
                            <li><strong>Expressão Facial:</strong> {pessoa.expressao_facial || 'Desconhecida'}</li>
                        </ul>
                    </div>
                ))}
            </div>

            <button onClick={onVoltar} className={styles.retakeButton}>Voltar</button>
        </div>
    );
};

export default BuscarGemeo;

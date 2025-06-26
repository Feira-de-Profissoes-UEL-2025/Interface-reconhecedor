import React, { useState } from 'react';
import FormularioAlmaGemela from './components/FormularioAlmaGemela';
import FormularioCamera from './components/FormularioAlmaGemela';

function App() {
  const [fotoUsuario, setFotoUsuario] = useState(null);
  const [fotoGemelo, setFotoGemelo] = useState(null);
  const [fotoAlmaGemela, setFotoAlmaGemela] = useState(null);
  const [loading, setLoading] = useState(false);

  const iniciarProceso = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/procesar-imagen');
      const data = await res.json();
      setFotoUsuario(data.fotoUsuario);
      setFotoGemelo(data.imagenGemelo);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarAlmaGemela = async (preferencias) => {
    try {
      const res = await fetch('http://localhost:5000/buscar-alma-gemela', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferencias)
      });
      const data = await res.json();
      setFotoAlmaGemela(data.imagenAlmaGemela);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    // <div style={{ padding: 20 }}>
    //   <h1>Buscador de Gemelos y Almas Gemelas</h1>

    //   <button onClick={iniciarProceso} disabled={loading}>
    //     {loading ? 'Procesando...' : 'Iniciar análisis IA'}
    //   </button>

    //   <div style={{ display: 'flex', gap: 40, marginTop: 20 }}>
    //     {fotoUsuario && (
    //       <div>
    //         <h3>Tu foto</h3>
    //         <img src={fotoUsuario} alt="usuario" width="200" />
    //       </div>
    //     )}
    //     {fotoGemelo && (
    //       <div>
    //         <h3>Tu gemelo</h3>
    //         <img src={fotoGemelo} alt="gemelo" width="200" />
    //       </div>
    //     )}
    //   </div>

    //   {fotoGemelo && (
    //     <FormularioAlmaGemela onBuscar={buscarAlmaGemela} />
    //   )}

    //   {fotoAlmaGemela && (
    //     <div style={{ marginTop: 30 }}>
    //       <h3>Tu alma gemela</h3>
    //       <img src={fotoAlmaGemela} alt="alma gemela" width="200" />
    //     </div>
    //   )}
    // </div>
    <FormularioCamera />
  );
}

export default App;

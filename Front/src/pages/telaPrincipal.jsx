import React, { useState, useEffect } from "react";
import { apiAtividade } from "../api/server";

export function TelaPrincipal() {
  const [content, setContent] = useState(<TurmaList showForm={showForm} />);

  function showList() {
    setContent(<TurmaList showForm={showForm} />);
  }

  function showForm(turma) {
    setContent(<TurmaForm turma={turma} showList={showList} />);
  }

  return (
    <div className="container my-5">
      {content}
    </div>
  );
}

function TurmaList(props) {
  const [turmas, setTurmas] = useState([]);

  function fetchTurmas() {
    apiAtividade.get(`/turmas`)
    .then((response) => {
        console.log(response);
        if (!response.ok && response.status!== 200) {
          throw new Error(`Unexpected Server Response: ${response.status} ${response.statusText}`);
        }
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        } else {
          throw new Error('Invalid response from server');
        }
      })
    .then((data) => {
        setTurmas(data);
      })
    .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchTurmas();
  }, []);
  
  function deleteTurmas(id) {
    apiAtividade.delete(`/deletarTurma/${id}`)
     .then((response) => {
        if (!response.ok) {
          fetchTurmas();
        } else {
          throw new Error("Unexpected Server Response");
        }
      })
     .catch((error) => console.error(error));
  }

  return (
    <>
      <h2 className="text-center mb-3">Turmas</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        Cadastrar Turma
      </button>
      <br />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {
          turmas.map((turma, index) => {
            return (
              <tr key={index}>
                <td>{turma.id}</td>
                <td>{turma.nome}</td>
                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => props.showForm(turma)}
                    className="btn btn-primary btn-sm me-2"
                    type="button"
                  >
                    Visualizar
                  </button>
                  <button
                    onClick={() => deleteTurmas(turma.id)}
                    className="btn btn-danger btn-sm"
                    type="button"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function TurmaForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newTurma, setNewTurma] = useState(props.turma? props.turma : {
    nome: '',
    nomeProfessor: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTurma({...newTurma, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { nome, nomeProfessor } = newTurma;
    if (!nome || !nomeProfessor ) {
      setErrorMessage("Please, provide all the required fields!");
      return;
    }
    if (props.turma.id) {
      updateturma(props.turma.id, newTurma);
    } else {
      createTurma(newTurma);
    }
  };

  const createTurma = (turma) => {
    apiAtividade.post(`/postarTurma`, turma)
     .then((response) => {
        setErrorMessage(null);
        setNewTurma({
          nome: '',
          nomeProfessor: '',
        });
        alert('Turma criada com sucesso!');
      })
     .catch((error) => {
        setErrorMessage('Erro ao criar turma!');
        console.error(error);
      });
  };
  

  return (
    <>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          {errorMessage && (
            <div className="alert alert-warning" role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={(event) => handleSubmit(event)}>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Nome da Turma</label>
              <div className="col-sm-8">
                <input
                  name="nome"
                  type="text"
                  className="form-control"
                  defaultValue={props.turma.nome}
                  placeholder="Nome da Turma"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm4 col-form-label">Nome do Professor</label>
              <div className="col-sm-8">
                <input
                  name="nomeProfessor"
                  type="text"
                  className="form-control"
                  defaultValue={props.turma.nomeProfessor}
                  placeholder="Nome do Professor"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="offset-sm-4 col-sm-4 d-grid">
                <button className="btn btn-primary btn-sm me-3" type="submit">
                  Salvar
                </button>
              </div>
              <div className="col-sm-4 d-grid">
                <button
                  onClick={() => props.showList()}
                  className="btn btn-secondary me-2"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default TelaPrincipal;   
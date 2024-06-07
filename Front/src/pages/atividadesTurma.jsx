import React, { useState, useEffect } from "react";
import { apiAtividade } from "../api/server";

export function AtividadesTurma() {
  const [content, setContent] = useState(<AtividadeList showForm={showForm} />);

  function showList() {
    setContent(<AtividadeList showForm={showForm} />);
  }

  function showForm(turma) {
    setContent(<AtividadeForm turma={turma} showList={showList} />);
  }

  return (
    <div className="container my-5">
      {content}
    </div>
  );
}

function AtividadeList(props) {
  const [atividades, setAtividades] = useState([]);

  function fetchAtividades() {
    apiAtividade.get(`/atividades`)
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
        setAtividades(data);
      })
   .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchAtividades();
  }, []);
  
  return (
    <>
      <h2 className="text-center mb-3">Atividades</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        Cadastrar Atividade
      </button>
      <br />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          {
          atividades.map((atividade, index) => {
            return (
              <tr key={index}>
                <td>{atividade.id}</td>
                <td>{atividade.nome}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function AtividadeForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newAtividade, setNewAtividade] = useState(props.turma? props.turma : {
    idTurma: '',
    idProfessor: '',
    nomeTurma: '',
    descricao: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAtividade({...newAtividade, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { idTurma, idProfessor, nomeTurma, descricao } = newAtividade;
    if (!nomeTurma ) {
      setErrorMessage("Please, provide all the required fields!");
      return;
    }
    if (props.turma.id) {
      updateAtividade(props.turma.id, newAtividade);
    } else {
      createAtividade(newAtividade);
    }
  };

  const createAtividade = (atividade) => {
    apiAtividade.post(`/postarAtividade`, atividade)
     .then((response) => {
        setErrorMessage(null);
        setNewAtividade({
          nomeTurma: '',
          descricao: '',
        });
        alert('Atividade criada com sucesso!');
      })
     .catch((error) => {
        setErrorMessage('Erro ao criar atividade!');
        console.error(error);
      });
  };

  const updateAtividade = (id, atividade) => {
    apiAtividade.put(`/updateAtividade/${id}`, atividade)
     .then((response) => {
        setErrorMessage(null);
        setNewAtividade({
          nomeTurma: '',
          descricao: '',
        });
        alert('Atividade atualizada com sucesso!');
      })
     .catch((error) => {
        setErrorMessage('Erro ao atualizar atividade!');
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
              <label className="col-sm-4 col-form-label">Nome da Atividade</label>
              <div className="col-sm-8">
                <input
                  name="nomeTurma"
                  type="text"
                  className="form-control"
                  value={newAtividade.nomeTurma}
                  placeholder="Nome da Atividade"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Descrição da Atividade</label>
              <div className="col-sm-8">
                <input
                  name="descricao"
                  type="text"
                  className="form-control"
                  value={newAtividade.descricao}
                  placeholder="Descrição da Atividade"
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

export default AtividadesTurma;
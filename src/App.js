import React, { useState, useEffect } from "react";

import api from './services/api';
import "./styles.css";

function App() {
  const [repos, setRepos] = useState([]);

  function loadRepositorios() {
    api.get('repositories')
      .then(res => setRepos(res.data))
      .catch((error) => {
        console.error(error);
        alert('Error ao tentar buscar repositórios!');
    });
  }

  useEffect(loadRepositorios, []);

  async function handleAddRepository() {
    try {
      const newRepo = {
        url: "https://github.com/alexbispo/reacjs-basics",
        title: `Teste ${Date.now()}`,
        techs: ["Tech 1", "Tech 2"]
      };

      const res = await api.post('repositories', newRepo);

      const repo = res.data;

      setRepos([...repos, repo]);
    } catch (error) {
      console.error(error);
      alert('Erro ao tentar adicionar repositório!');
    }
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`repositories/${id}`);

      const result = repos.filter(repo => repo.id !== id);
      setRepos(result);
    } catch (error) {
      console.error(error);
      alert('Erro ao tentar remover repositório!')
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repos.map(repo => {
          return (
            <li key={repo.id}>
              {repo.title}

              <button onClick={() => handleRemoveRepository(repo.id)}>
                Remover
              </button>
            </li>
          );
        })}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;

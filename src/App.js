import React, { useState, useEffect } from "react";

import api from './services/api';
import "./styles.css";

function App() {
  const [repos, setRepos] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [techs, setTechs] = useState([]);

  function loadRepositories() {
    api.get('repositories')
      .then(res => setRepos(res.data))
      .catch((error) => {
        console.error(error);
        alert('Error ao tentar buscar repositórios!');
    });
  }

  useEffect(loadRepositories, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const newRepo = {
        url,
        title,
        techs
      };

      const res = await api.post('repositories', newRepo);

      const repo = res.data;

      setRepos([...repos, repo]);
      setUrl("");
      setTitle("");
      setTechs([]);
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

  function handleUrlChange(event) {
    setUrl(event.target.value);
  }

  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  function handleTechsChange(event) {
    const value = event.target.value.split(',');
    const newTechs = value instanceof Array ? value : [value];

    setTechs(newTechs);
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repos.map(repo => {
          return (
            <li key={repo.id}>
              {repo.title}

              <button className="button button-danger" onClick={() => handleRemoveRepository(repo.id)}>
                Remover
              </button>
            </li>
          );
        })}
      </ul>

      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={handleTitleChange} />
        </label>
        <label>
          Url:
          <input type="text" value={url} onChange={handleUrlChange} />
        </label>
        <label>
          Techs:
          <input type="text" value={techs} onChange={handleTechsChange} />
        </label>

        <input type="submit" value="Adicionar"  className="button"/>
      </form>
    </div>
  );
}

export default App;

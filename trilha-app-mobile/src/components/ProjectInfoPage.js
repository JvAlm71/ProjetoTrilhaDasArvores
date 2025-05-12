import React from 'react';
import './../App.css'; 

function ProjectInfoPage() {
  const cronogramaData = [
    { etapa: "Organização inicial e planejamento", periodo: "27/04/2025", marco: "Definição da estrutura inicial do projeto", artefato: "Backlog (inicial) de funcionalidades e plano de ação" },
    { etapa: "Levantamento e detalhamento de requisitos", periodo: "05/05/2025", marco: "Finalização dos requisitos", artefato: "Documento de requisitos priorizados e planejamento das entrevistas" },
    { etapa: "Contato e alinhamento com o cliente", periodo: "07/05/2025", marco: "Realização da entrevista inicial", artefato: "Registro das avaliações e ajustes com o cliente" },
    { etapa: "Análise de requisitos e prototipagem", periodo: "10/05/2025", marco: "Entrega dos protótipos e modelos de software", artefato: "Protótipo funcional e definição do modelo de dados" },
    { etapa: "Primeira iteração de desenvolvimento (Sprint 1)", periodo: "03/06/2025", marco: "Primeira entrega parcial", artefato: "Funcionalidade inicial de apresentação do projeto no app" },
    { etapa: "Segunda iteração de desenvolvimento (Sprint 2)", periodo: "07/06/2025", marco: "Segunda entrega parcial", artefato: "X" },
    { etapa: "Terceira iteração de desenvolvimento (Sprint 3)", periodo: "13/06/2025", marco: "Terceira entrega parcial", artefato: "X" },
    { etapa: "Consolidação final e entrega do projeto", periodo: "26/06/2025", marco: "Apresentação e finalização do produto", artefato: "Aplicativo funcional, vídeo demonstrativo e apresentação dos resultados" },
  ];

  const riscosData = [
    { risco: "Pressão sobre os prazos de entrega", probabilidade: "100%", impacto: 3 },
    { risco: "Falta de clareza na definição inicial do escopo", probabilidade: "60%", impacto: 3 },
    { risco: "Falta de familiaridade da equipe com desenvolvimento Mobile", probabilidade: "70%", impacto: 2 },
    { risco: "Falha na integração com APIs de geolocalização", probabilidade: "65%", impacto: 2 },
    { risco: "Dificuldade de integração com tecnologias de áudio e chatbot", probabilidade: "65%", impacto: 2 },
    { risco: "Dificuldade de integração de ChatBot de IA", probabilidade: "60%", impacto: 2 },
    { risco: "Problemas de desempenho no carregamento de áudios e chatbot", probabilidade: "50%", impacto: 2 },
  ];

  const integrantes = [
    { nome: "Daniel Filho", nusp: "Não informado" },
    { nome: "Jean Carlos Pereira Cassiano", nusp: "Não informado" },
    { nome: "João Victor de Almeida", nusp: "Não informado" },
    { nome: "Karine Cerqueira Nascimento", nusp: "13718404" },
    { nome: "Lucas Corlete Alves de Melo", nusp: "13676461" },
    { nome: "Lucas Fernandes", nusp: "11800389" },
  ];

  return (
    <div className="page-container project-info-page">
      <h2 className="page-title">Sobre o Projeto TrilhaApp</h2>

      <section className="card">
        <h3>Identificação do Projeto</h3>
        <p><strong>Nome:</strong> TrilhaApp</p>
        <p><strong>Equipe:</strong> Lobo</p>
        <p><strong>Data de Criação do Documento Base:</strong> 27/04/2025</p>
      </section>

      <section className="card">
        <h3>Integrantes da Equipe</h3>
        <ul className="integrantes-list">
          {integrantes.map(integrante => (
            <li key={integrante.nusp || integrante.nome}>
              {integrante.nome} (N° USP: {integrante.nusp})
            </li>
          ))}
        </ul>
      </section>
      
      <section className="card">
        <h3>Introdução</h3>
        <p>O TrilhaApp visa tornar a experiência na Trilha das Árvores da ESALQ mais acessível e imersiva, fruto da colaboração entre alunos do ICMC-USP e a ESALQ-USP. O objetivo é aproximar a comunidade da biodiversidade do campus através de uma ferramenta tecnológica engajadora.</p>
      </section>

      <section className="card">
        <h3>Escopo</h3>
        <p>Desenvolver uma aplicação mobile que apresente trilhas, forneça informações sobre árvores via QR Codes, e inclua um chatbot interativo. A interface deve ser intuitiva, com mapas, descrições claras e funcionalidades acessíveis.</p>
      </section>

      <section className="card">
        <h3>Tecnologias (Plano Original vs. Implementação Atual)</h3>
        <p><strong>Plano Original:</strong> Backend em Python (Flask/FastAPI), Frontend em Flutter ou React Native, QR Code com Python Qrcode, Chatbot com API Gemini.</p>
        <p><strong>Interface Gráfica Atual (Protótipo):</strong> Desenvolvida em React para demonstração da interface e fluxos de usuário. A integração com backend e funcionalidades como leitura real de QR Code e chatbot com IA seriam os próximos passos.</p>
        <p><strong>Gestão:</strong> Scrum, Trello, GitHub.</p>
      </section>

      <section className="card">
        <h3>Cronograma e Marcos Principais</h3>
        <p>Início do projeto: 27/04/2025 | Término Previsto: 26/06/2025</p>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Etapa</th>
                <th>Período</th>
                <th>Marco</th>
                <th>Artefato Entregue</th>
              </tr>
            </thead>
            <tbody>
              {cronogramaData.map((item, index) => (
                <tr key={index}>
                  <td>{item.etapa}</td>
                  <td>{item.periodo}</td>
                  <td>{item.marco}</td>
                  <td>{item.artefato}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3>Gerência de Riscos (Principais)</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Risco</th>
                <th>Probabilidade</th>
                <th>Impacto (Escala 1-3)</th>
              </tr>
            </thead>
            <tbody>
              {riscosData.map((item, index) => (
                <tr key={index}>
                  <td>{item.risco}</td>
                  <td>{item.probabilidade}</td>
                  <td>{item.impacto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3>Estratégia de Testes</h3>
        <p>Testes progressivos: unitários, de integração, de sistema e de aceitação do usuário. Foco na usabilidade, precisão das informações, funcionamento do QR Code, chatbot e audioguia.</p>
        <p><strong>Exemplos de Cenários de Teste:</strong></p>
        <ul>
            <li>Visualização de trilhas sem login.</li>
            <li>Leitura (simulada) de QR Code e exibição correta das informações da árvore.</li>
            <li>Interação com chatbot (simulado) e audioguia (simulado).</li>
            <li>Navegação intuitiva entre telas.</li>
        </ul>
      </section>
    </div>
  );
}

export default ProjectInfoPage;
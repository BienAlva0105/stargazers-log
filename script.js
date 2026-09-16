const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");

const formatDate = (date) => new Intl.DateTimeFormat("en", {
  dateStyle: "medium"
}).format(new Date(`${date}T00:00:00`));

const formatStars = (count) => `${new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1
}).format(count)} stars`;

const renderRepositories = (repositories) => {
  repositoryCount.textContent = `${repositories.length} saved`;

  if (repositories.length === 0) {
    repositoryList.innerHTML = '<p class="status">No starred repositories yet.</p>';
    return;
  }

  repositoryList.innerHTML = repositories.map((repository) => `
    <article class="repository">
      <div>
        <p class="repository-name">${repository.full_name}</p>
        <h3><a href="${repository.html_url}" target="_blank" rel="noreferrer">${repository.name}</a></h3>
        <p class="repository-description">${repository.description}</p>
      </div>
      <div class="repository-meta">
        <span class="language">${repository.language}</span>
        <span>${formatStars(repository.stargazers_count)}</span>
        <time datetime="${repository.starred_at}">${formatDate(repository.starred_at)}</time>
      </div>
    </article>
  `).join("");
};

const loadRepositories = async () => {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    renderRepositories(await response.json());
  } catch (error) {
    repositoryCount.textContent = "Unavailable";
    repositoryList.innerHTML = '<p class="status error">The repository list could not be loaded. Try again when the data file is available.</p>';
    console.error(error);
  }
};

loadRepositories();
const projectsUrl = "http://localhost:5678/api/works";
const categoriesUrl = "http://localhost:5678/api/categories";

// Fonction pour récupérer les projets depuis l'API
function fetchProjects() {
  fetch(projectsUrl)
    .then(response => response.ok ? response.json() : Promise.reject('Erreur lors de la récupération des données des projets'))
    .then(data => displayProjects(data))
    .catch(error => console.error("Erreur :", error));
}

// Fonction pour récupérer les catégories depuis l'API
function fetchCategories() {
  fetch(categoriesUrl)
    .then(response => response.ok ? response.json() : Promise.reject('Erreur lors de la récupération des données des catégories'))
    .then(data => createFilterButtons(data))
    .catch(error => console.error("Erreur :", error));
}

// Fonction pour afficher les projets dans la galerie
function displayProjects(projects) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  projects.forEach(project => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project");

    const image = document.createElement("img");
    image.src = project.imageUrl;
    image.alt = project.title;
    projectElement.appendChild(image);

    const caption = document.createElement("p");
    caption.textContent = project.title;
    projectElement.appendChild(caption);

    gallery.appendChild(projectElement);
  });
}

// Fonction pour créer les boutons de filtrage
function createFilterButtons(categories) {
  const filterButtonsContainer = document.getElementById("filterButtons");

  // Bouton "Tout Afficher"
  const showAllButton = document.createElement("button");
  showAllButton.textContent = "Tout";
  showAllButton.classList.add("filter-button", "active-filter");
  showAllButton.addEventListener("click", () => {
    fetchProjects();
    toggleActiveFilter(showAllButton);
  });
  filterButtonsContainer.appendChild(showAllButton);

  // Boutons de filtre par catégorie
  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filter-button");
    button.addEventListener("click", () => {
      filterProjectsByCategory(category.id);
      toggleActiveFilter(button);
    });
    filterButtonsContainer.appendChild(button);
  });
}

// Fonction pour filtrer les projets par catégorie
function filterProjectsByCategory(categoryId) {
  fetch(projectsUrl)
    .then(response => response.ok ? response.json() : Promise.reject('Erreur lors de la récupération des données des projets'))
    .then(data => {
      const filteredProjects = data.filter(project => project.categoryId === categoryId);
      displayProjects(filteredProjects);
    })
    .catch(error => console.error("Erreur :", error));
}

// Fonction pour activer ou désactiver la classe 'active-filter'
function toggleActiveFilter(activeButton) {
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach(button => {
    button.classList.toggle("active-filter", button === activeButton);
  });
}

// Appel des fonctions pour récupérer les projets et les catégories
fetchProjects();
fetchCategories();

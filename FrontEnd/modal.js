// Fonction pour récupérer les catégories et les ajouter au modal
function fetchCategoriesModal() {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById("form-category");
            categorySelect.innerHTML = '<option value=""></option>';

            data.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des catégories:', error);
        });
}

// Écouteur d'événement pour le chargement du DOM
document.addEventListener("DOMContentLoaded", function() {

    // Fonction pour créer le modal
    function createModal() {
        let modal = document.createElement("div");
        modal.id = "myModal";
        modal.className = "modal";

        let modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        let closeBtn = document.createElement("span");
        closeBtn.className = "close";
        closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        let modalHeader = document.createElement("h2");
        modalHeader.textContent = "Galerie photo";

        let modalContentProjects = document.createElement("div");
        modalContentProjects.id = "modalProjectsContainer";

        let addBtnModalContainer = document.createElement("div");
        addBtnModalContainer.className = "add-button-modal-container";

        let addProjectBtnModal = document.createElement("button");
        addProjectBtnModal.id = "add-project-button-modal";
        addProjectBtnModal.innerHTML = "Ajouter une photo";

        // Ajoute les éléments au modal
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalContentProjects);
        modalContent.appendChild(addBtnModalContainer);
        addBtnModalContainer.appendChild(addProjectBtnModal);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        let modalAddProjectContent = document.createElement("div");
        modalAddProjectContent.className = "modal-add-project-content";
        modalAddProjectContent.style.display = "none";

        let modalAddProjectIcon = document.createElement("div");
        modalAddProjectIcon.className = "modal-add-project-icon";

        let modalAddProjectIconBack = document.createElement("span");
        modalAddProjectIconBack.className = "back";
        modalAddProjectIconBack.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';

        let modalAddProjectIconClose = document.createElement("span");
        modalAddProjectIconClose.className = "close";
        modalAddProjectIconClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        let modalAddProjectHeader = document.createElement("h2");
        modalAddProjectHeader.innerHTML = "Ajout photo";

        let modalAddProjectForm = document.createElement("form");
        modalAddProjectForm.className = "modal-add-project-form";

        let newImg = document.createElement("div");
        newImg.className = "modal-new-image";
        newImg.innerHTML = `<i id= "photo-add-icon" class="fa-regular fa-image"></i>
        <label id="new-image">+ Ajouter photo</label>
        <input id="form-image" type="file" name="image" accept="image/*, .jpg, .jpeg, .png" required>
        <p id="photo-size">jpg, png : 4mo max</p>`;

        let imagePreview = document.createElement("img");
        imagePreview.id = "image-preview";
        imagePreview.style.display = "none";
        imagePreview.style.width = "129px";
        imagePreview.style.height = "193px";
        imagePreview.alt = "Aperçu de l'image";

        newImg.insertBefore(imagePreview, newImg.firstChild);

        let newCategory = document.createElement("div");
        newCategory.className = "modal-new-category";
        newCategory.innerHTML = `<label for="form-title">Titre</label>
        <input type="text" name="title" id="form-title" value="" required>
        <label for="form-category">Catégorie</label>
        <select class="choice-category" id="form-category" required>
            <option value=""></option>
        </select>
        <hr class="border-bottom">
        <input type="submit" id="submit-new-work" value="Valider">`;

        // Ajoute les éléments au formulaire du modal
        modalAddProjectForm.appendChild(newImg);
        modalAddProjectForm.appendChild(newCategory);
        modalAddProjectIcon.appendChild(modalAddProjectIconBack);
        modalAddProjectIcon.appendChild(modalAddProjectIconClose);
        modalAddProjectContent.appendChild(modalAddProjectIcon);
        modalAddProjectContent.appendChild(modalAddProjectHeader);
        modalAddProjectContent.appendChild(modalAddProjectForm);
        modal.appendChild(modalAddProjectContent);

        document.body.appendChild(modal);

        // Événement sur le bouton de validation du formulaire
        document.getElementById("submit-new-work").addEventListener("click", function (event) {
            event.preventDefault();
            addProject();
        });
 
        // Gestion de la fermeture du modal
        closeBtn.onclick = function () {
            modal.style.display = "none";
            modalAddProjectContent.style.display = "none";
            modalContent.style.display = "block";
        };

        modalAddProjectIconBack.onclick = function () {
            modalAddProjectContent.style.display = "none";
            modalContent.style.display = "block";
        };

        modalAddProjectIconClose.onclick = function () {
            modal.style.display = "none";
            modalAddProjectContent.style.display = "none";
            modalContent.style.display = "block";
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
                modalAddProjectContent.style.display = "none";
                modalContent.style.display = "block";
            }
        };

        addProjectBtnModal.onclick = function () {
            modalContent.style.display = "none";
            modalAddProjectContent.style.display = "block";
        };

        closeBtn.onclick = function () {
            modal.style.display = "none";
        };

        // Fonction pour vérifier si tous les champs sont remplis
        function checkFormFields() {
            const title = document.getElementById("form-title").value;
            const category = document.getElementById("form-category").value;
            const image = document.getElementById("form-image").files.length > 0;
            
            const submitButton = document.getElementById("submit-new-work");

            if (title && category && image) {
                submitButton.style.pointerEvents = "auto";
            } else {
                submitButton.style.pointerEvents = "none";
            }
        }

        // Écouteurs d'événements pour les champs du formulaire
        document.getElementById("form-title").addEventListener("input", checkFormFields);
        document.getElementById("form-category").addEventListener("change", checkFormFields);
        document.getElementById("form-image").addEventListener("change", checkFormFields);

        // Gestion de l'aperçu de l'image ajoutée
        const imageInput = document.getElementById('form-image');
        imageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    document.getElementById('photo-add-icon').style.display = 'none';
                    document.getElementById('new-image').style.display = 'none';
                    document.getElementById('photo-size').style.display = 'none';
                    document.getElementById('form-image').style.display = 'none';

                    let modalNewImage = document.getElementsByClassName("modal-new-image")[0];
                    modalNewImage.style.padding = "0px";
                };

                reader.readAsDataURL(file);
            } else {
                imagePreview.style.display = 'none';
                document.getElementById('photo-add-icon').style.display = 'block';
                document.getElementById('new-image').style.display = 'block';
            }
            checkFormFields();
        });
 
        return modal;
    }

    // Fonction pour récupérer les projets et les afficher dans le modal
    function fetchProjects(callback) {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                callback(data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des projets:', error);
            });
    }

    // Fonction pour afficher les projets dans le modal
    function displayProjectsModal(projects) {
        const projectsContainer = document.getElementById("modalProjectsContainer");
        projectsContainer.innerHTML = "";

        projects.forEach(project => {
            const projectElement = document.createElement("div");
            projectElement.className = "projects";

            const projectImage = document.createElement("img");
            projectImage.style.width = "80px";
            projectImage.style.height = "auto";
            projectImage.style.position = "relative";
            projectImage.src = project.imageUrl;

            const deleteIcon = document.createElement("span");
            deleteIcon.className = "delete-icon";
            
            deleteIcon.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';

            // Ajoute l'événement de suppression de projet
            deleteIcon.addEventListener("click", function() {
                deleteProject(project.id, projectElement);
            });

            projectElement.appendChild(projectImage);
            projectElement.appendChild(deleteIcon);
            projectsContainer.appendChild(projectElement);
        });
    }

    // Fonction pour supprimer un projet
    async function deleteProject(projectId, projectElement) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du projet');
            }

            console.log(`Projet avec l'ID: ${projectId} supprimé`);
            projectElement.remove();

        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    // Fonction pour ajouter un projet
    async function addProject() {
        const title = document.getElementById("form-title").value;
        const category = document.getElementById("form-category").value;
        const imageInput = document.getElementById("form-image");
        const image = imageInput.files[0];
        
        if (!title || !category || !image) {
            alert("Tous les champs sont requis.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("image", image);

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du projet');
            }

            document.getElementById("form-title").value = '';
            document.getElementById("form-category").value = '';
            document.getElementById("form-image").value = '';
            document.getElementById("myModal").style.display = "none";

        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    // Si le bouton d'édition existe, ajoute un événement de clic qui affiche le modal (le crée s'il n'existe pas),
    // charge et affiche les projets existants et récupère les catégories pour le formulaire du modal.
    const editButton = document.getElementById("editButton");
    if (editButton) {
        editButton.addEventListener("click", function () {
            let modal = document.getElementById("myModal") || createModal();
            modal.style.display = "block";
            fetchProjects(displayProjectsModal);
            fetchCategoriesModal();
        });
    }

    // Rend les fonctions accessibles globalement pour un usage externe
    window.createModal = createModal;
    window.fetchCategoriesModal = fetchCategoriesModal;
    window.displayProjectsModal = displayProjectsModal;
    window.deleteProject = deleteProject;
    window.addProject = addProject;
});

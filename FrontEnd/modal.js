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

document.addEventListener("DOMContentLoaded", function() {
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

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalContentProjects);
        modalContent.appendChild(addBtnModalContainer);
        addBtnModalContainer.appendChild(addProjectBtnModal);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Modale pour l'ajout de projet
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

        modalAddProjectForm.appendChild(newImg);
        modalAddProjectForm.appendChild(newCategory);
        modalAddProjectIcon.appendChild(modalAddProjectIconBack);
        modalAddProjectIcon.appendChild(modalAddProjectIconClose);
        modalAddProjectContent.appendChild(modalAddProjectIcon);
        modalAddProjectContent.appendChild(modalAddProjectHeader);
        modalAddProjectContent.appendChild(modalAddProjectForm);
        modal.appendChild(modalAddProjectContent);

        document.body.appendChild(modal);

        document.getElementById("submit-new-work").addEventListener("click", function (event) {
            event.preventDefault();
            addProject();
        });
 
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

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };

        return modal;
    }

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

            deleteIcon.addEventListener("click", function() {
                deleteProject(project.id, projectElement);
            });

            projectElement.appendChild(projectImage);
            projectElement.appendChild(deleteIcon);
            projectsContainer.appendChild(projectElement);
        });
    }

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

            fetchProjects();
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    const editButton = document.getElementById("editButton");
    if (editButton) {
        editButton.addEventListener("click", function () {
            let modal = document.getElementById("myModal") || createModal();
            modal.style.display = "block";
            fetchProjects(displayProjectsModal);
            fetchCategoriesModal();
        });
    }

    window.createModal = createModal;
    window.fetchCategoriesModal = fetchCategoriesModal;
    window.displayProjectsModal = displayProjectsModal;
    window.deleteProject = deleteProject;
    window.addProject = addProject;
});

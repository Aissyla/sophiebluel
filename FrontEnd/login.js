document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");
    const errorMessageElement = document.getElementById("error-message");
    const loginLink = document.getElementById("login");
    const logoutLink = document.getElementById("logout");
    const modeEditionElement = document.querySelector(".mode-edition");
    const editButtonContainer = document.getElementById("titleProjects");

    function editButton() {
        if (editButtonContainer) {
            const existingButton = document.getElementById("editButton");
            if (!existingButton) {
                const divEditButton = document.createElement("button");
                divEditButton.id = "editButton";
                divEditButton.innerHTML = `<span><i class="fa-regular fa-pen-to-square"></i> modifier</span>`;
                editButtonContainer.appendChild(divEditButton);

                divEditButton.onclick = function() {
                    let modal = document.getElementById("myModal") || createModal();
                    modal.style.display = "block";
                    fetchProjects(displayProjectsModal);
                    fetchCategoriesModal();
                };
            }
        }
    }

    function removeEditButton() {
        if (editButtonContainer) {
            const existingButton = document.getElementById("editButton");
            if (existingButton) {
                existingButton.remove();
            }
        }
    }

    if (localStorage.getItem('token') && localStorage.getItem('userId')) {
        editButton();
        const logoutButton = document.getElementById("log");
        if (logoutButton) {
            logoutButton.textContent = "logout";
            logoutButton.href = "#";
            logoutButton.onclick = function() {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.href = "login.html";
            };
        }
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        if (errorData && errorData.message) {
                            throw new Error("Email ou mot de passe incorrect!");
                        } else {
                            throw new Error("Erreur inconnue!");
                        }
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log(data);

                if (data.userId && data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);

                    if (loginLink) loginLink.style.display = "none";
                    if (logoutLink) logoutLink.style.display = "block";
                    if (modeEditionElement) modeEditionElement.style.display = "flex";
                    if (errorMessageElement) errorMessageElement.style.display = "none";

                    editButton();

                    window.location.href = "index.html";
                } else {
                    if (errorMessageElement) {
                        errorMessageElement.textContent = "E-mail ou mot de passe incorrect.";
                        errorMessageElement.style.display = "block";
                    }
                }
            })
            .catch(error => {
                console.error("Erreur:", error);
                if (errorMessageElement) {
                    errorMessageElement.textContent = error.message || "Une erreur s'est produite. Veuillez réessayer plus tard.";
                    errorMessageElement.style.display = "block";
                }
            });
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener("click", function(event) {
            event.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('userId');

            if (loginLink) loginLink.style.display = "block";
            if (logoutLink) logoutLink.style.display = "none";
            if (modeEditionElement) modeEditionElement.style.display = "none";
            
            removeEditButton();

            window.location.href = "login.html";
        });
    }

    if (localStorage.getItem('token') && localStorage.getItem('userId')) {
        if (loginLink) loginLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "block";
        if (modeEditionElement) modeEditionElement.style.display = "flex";
        
        editButton();
    } else {
        if (loginLink) loginLink.style.display = "block";
        if (logoutLink) logoutLink.style.display = "none";
        if (modeEditionElement) modeEditionElement.style.display = "none";
    }
});

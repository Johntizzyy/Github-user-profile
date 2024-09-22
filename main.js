const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");


async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);
    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard("Invalid username");
    } else if (err.response.status == 403){
        createErrorCard("Error fetching user data")
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
    addReposToCard(data);
  } catch (error) {
    // createRepoError("Error fetching repos");
    // console.log("Error",error)
  }
}

getRepos("johntizzyy");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let user = search.value;
  if (user) {
    getUser(user);
    search.value = "";
  }
});

function addReposToCard(repos) {
  repos.slice(0,10).forEach((repo) => {
    const reposEl = document.getElementById("repos");


    console.log(repo);
    const repoLink = document.createElement("a");
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";
    repoLink.innerText = repo.name;

    reposEl.appendChild(repoLink);
  });
}

function createUserCard(user) {
  const cardHTML = `
        <div class="card">
      <div class="profile-image">
        <img src=${user.avatar_url} alt=${user.name} />
      </div>
      <div class="user-info">
        <h1>${user.name}</h1>
        <p>
${user.bio != null ? user.bio : "No bio"}
        </p>

        <ul>
          <li><strong>${user.followers}</strong>  followers</li>
          <li><strong>${user.following}</strong> following</li>
          <li><strong>${user.public_repos}</strong> repos</li>
        </ul>

        <div id="repos">
        </div>
      </div>
    </div>
    `;
  main.innerHTML = cardHTML;
}

function createErrorCard(message) {
  const cardHTML = `
    <div class="card">
        <h1>${message}</h1>
    </div>
    `;
  main.innerHTML = cardHTML;
}


// function createRepoError(message) {
//     const reposEl = document.getElementById("repos");


//     const errorCard = `
//     <div class="card">
//         <h1>${message}</h1>
//     </div>
//     `;

//     // reposEl.innerText = `Hey`;
//     // reposEl.appendChild(errorCard)
//     console.log(reposEl)
// }

function createRepoError(message) {
    const reposEl = document.getElementById("repo");

    // Clear previous content in reposEl
    reposEl.innerHTML = '';

    // Create a new div element for the error message
    const errorCard = document.createElement("div");
    errorCard.className = "card"; // Add a class for styling
    errorCard.innerHTML = `<h1>${message}</h1>`; // Set inner HTML

    // Append the error card to reposEl
    reposEl.appendChild(errorCard);
}

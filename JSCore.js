const inputSearch = document.querySelector(".search__input");
const searchList = document.querySelector(".search__list");
const savedList = document.querySelector(".saved-list");
let searchListItem = [];
let deleteButton = [];
let savedArrayID = [];
const URL = "https://api.github.com/";

const debounce = (fn, t) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(fn.bind(this, ...args), t);
  };
};

const getRepo = async (value) => {
  const response = await fetch(
    `${URL}search/repositories?q=${value.trim()}&per_page=5&page=1`
  );
  return await response.json();
};

const createList = (res) => {
  searchList.innerHTML = res.items.reduce((acc, element) => {
    return `${acc}<li class="search__list-item">${element.name}</li>`;
  }, ``);
  searchListItem = document.querySelectorAll(".search__list-item");
};

const handleResponse = async (e) => {
  const { value } = e.target;
  if (value.trim() !== "") {
    try {
      const result = await getRepo(value);
      createList(result);
      itemData(searchListItem, result);
    } catch (err) {
      alert("Превышен лимит запросов");
    }
  } else {
    searchList.innerHTML = "";
  }
};

const handleDebounce = debounce(handleResponse, 200);
inputSearch.addEventListener("input", handleDebounce);

const itemData = (listItems, data) => {
  listItems.forEach((element, index) => {
    element.addEventListener("click", (e) => {
      if (!savedArrayID.includes(data.items[index].id)) {
        createElement(data.items[index]);
        inputSearch.value = "";
        searchList.innerHTML = "";
        deleteButton = document.querySelectorAll(".saved-list__item-button");
        deleteItem(deleteButton);
      }
    });
  });
};

const createElement = (item) => {
  savedArrayID.push(item.id);
  const savedElement = document.createElement("li");
  savedElement.classList.add("saved-list__item");
  savedElement.setAttribute(`id`, item.id);
  savedElement.innerHTML = `
  <div class="saved-list__item-content">
    <span class="saved-list__content-span">Name: ${item.name}</span>
    <span class="saved-list__content-span">Owner: ${item.owner.login}</span>
    <span class="saved-list__content-span">Stars: ${item.stargazers_count}</span>
  </div>
  <button class="saved-list__item-button">
    <img src="assets/img/cross_icon-icons.com_72347.svg" alt="delete" />
  </button>
  `;
  savedList.appendChild(savedElement);
};

const deleteItem = (btns) => {
  btns.forEach((element) => {
    element.addEventListener("click", () => {
      savedArrayID = savedArrayID.filter(
        (el) => el !== Number(element.parentNode.getAttribute("id"))
      );
      element.parentNode.remove();
    });
  });
};

const inputSearch = document.querySelector(".search__input");
const searchList = document.querySelector(".search__list");
const savedList = document.querySelector(".saved-list");
let searchListItem = [];
let deleteButton = [];
let savedArrayID = [];
const URL = "https://api.github.com/";

function debounce(fn, t) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(fn.bind(this, ...args), t);
  };
}
const handleResponse = async (e) => {
  const { value } = e.target;
  if (value.trim() !== "") {
    try {
      const response = await fetch(
        `${URL}search/repositories?q=${value.trim()}&per_page=5&page=1`
      );
      const result = await response.json();
      searchList.innerHTML = result.items.reduce((acc, element) => {
        return `${acc}<li class="search__list-item">${element.name}</li>`;
      }, ``);
      searchListItem = document.querySelectorAll(".search__list-item");
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
        savedArrayID.push(data.items[index].id);
        const savedElement = document.createElement("li");
        savedElement.classList.add("saved-list__item");
        savedElement.setAttribute(`id`, data.items[index].id);
        savedElement.innerHTML = `
        <div class="saved-list__item-content">
          <span class="saved-list__content-span">Name: ${data.items[index].name}</span>
          <span class="saved-list__content-span">Owner: ${data.items[index].owner.login}</span>
          <span class="saved-list__content-span">Stars: ${data.items[index].stargazers_count}</span>
        </div>
        <button class="saved-list__item-button">
          <img src="assets/img/cross_icon-icons.com_72347.svg" alt="delete" />
        </button>
        `;
        savedList.appendChild(savedElement);
        inputSearch.value = "";
        searchList.innerHTML = "";
        deleteButton = document.querySelectorAll(".saved-list__item-button");
        deleteItem(deleteButton);
      }
    });
  });
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

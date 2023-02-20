const state = {
  urls: null,
};

let allElements = [];

const baseURL = "http://swapi.dev/api/";

const buttons = document.getElementById("buttons");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const pageNumber = document.getElementById("pageNumber");
const detailsTable = document.getElementById("details");
const closeDetailsButton = document.getElementById("closeDetails");
const modal = document.getElementById("removeModal");
const detailsModal = document.getElementById("details");
const detailsText = document.createElement("p");
const removeConfirmButton = document.getElementById("removeConfirm");
const denidConfirmButton = document.getElementById("removeDenid");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("searchButton");

(async function main() {
  const data = await fetch(baseURL);
  const response = await data.json();
  state.urls = response;

  printButtons(response);
})();
function printButtons() {
  let page = 1;
  let itemsVisible = 0;
  state.currentTab = null;

  Object.entries(state.urls).forEach(([key, url]) => {
    const newButton = document.createElement("button");
    buttons.append(newButton);
    newButton.setAttribute("id", key);

    newButton.innerText = key;
    pageNumber.innerHTML = page;

    newButton.addEventListener("click", async function () {
      state.data = null;
      page = 1;
      itemsVisible = 0;

      state.currentTab = url;

      const response = await fetchDataOnClick(url, page, itemsVisible);

      console.log(response.results);

      printTable(response.results, page, itemsVisible);

      state.data = response;
    });
  });

  searchButton.addEventListener("click", async function searchOnClick() {
    const inputValue = searchInput.value;
    const url = state.currentTab;
    state.data = null;
    page = 1;
    itemsVisible = 0;

    console.log("wwww", inputValue, state);

    const response = await fetchDataOnClick(state.currentTab, page, inputValue);

    printTable(response.results, page, itemsVisible);

    state.data = response;
  });

  nextButton.addEventListener("click", async function () {
    if (!state.data.next) {
      alert("wiecej nie mam");
    } else {
      page++;

      const response = await newPage(state.data.next);

      itemsVisible = itemsVisible + response.results.length;
      printTable(response.results, page, itemsVisible);

      state.data = response;
    }
  });

  prevButton.addEventListener("click", async function () {
    if (!state.data.previous) {
      alert("nie da sie ");
    } else {
      page--;

      itemsVisible = itemsVisible - state.data.results.length;

      const response = await newPage(state.data.previous);

      printTable(response.results, page, itemsVisible);

      state.data = response;
    }
  });
}

const fetchDataOnClick = async (value, page, searchInput) => {
  allElements = [];
  try {
    const data = await fetch(
      `${value}/?page=${page}&search=${searchInput ? searchInput : ""}`
    );
    const response = await data.json();
    allElements.push(...response.results);
    allData(response);
    return response;
  } catch (e) {
    console.error(e);
  }
};

async function newPage(url) {
  const data = await fetch(url);
  const response = await data.json();
  return response;
}

function printTable(item, page, itemsVisible) {
  clearPage();

  pageNumber.innerHTML = page;

  const wrap = document.getElementById("tblWrapper");
  const tbl = document.createElement("table");
  wrap.appendChild(tbl);
  const tHead = document.createElement("thead");
  const tBody = document.createElement("tbody");
  const row = document.createElement("tr");

  /// header
  const idHeader = document.createElement("td");
  idHeader.innerText = "#";
  row.appendChild(idHeader);

  for (i = 0; i < 4; i++) {
    const cell = document.createElement("td");
    const cellText = document.createTextNode(Object.keys(item[0])[i]);
    cell.appendChild(cellText);
    row.appendChild(cell);
  }

  const createdColumn = document.createElement("td");
  createdColumn.innerText = "Created";
  row.appendChild(createdColumn);

  const actionColumn = document.createElement("td");
  actionColumn.innerText = "Action";
  row.appendChild(actionColumn);

  // tbody

  item.forEach((element, index) => {
    const bodyRow = document.createElement("tr");
    bodyRow.setAttribute("id", index);
    itemsVisible = itemsVisible + 1;
    bodyRow.innerHTML = itemsVisible;

    for (j = 0; j < 4; j++) {
      const cell = document.createElement("td");
      const cellText = document.createTextNode(`${Object.values(element)[j]}`);
      cell.appendChild(cellText);

      bodyRow.appendChild(cell);
    }

    const dataCell = document.createElement("td");
    const createdAt = element.created.split("T")[0];
    const cellText = document.createTextNode(createdAt);
    dataCell.appendChild(cellText);
    bodyRow.appendChild(dataCell);

    const actionCell = document.createElement("td");
    const details = document.createElement("button");
    details.innerText = "details";
    const remove = document.createElement("button");
    remove.innerText = "remove";
    actionCell.appendChild(details);
    actionCell.appendChild(remove);

    bodyRow.appendChild(actionCell);
    tBody.appendChild(bodyRow);

    details.onclick = function () {
      closeDetailsButton.onclick = () => {
        detailsModal.style.display = "none";
      };
      detailsModal.style.display = "block";
      detailsText.innerText = `obiecuje beda tu detailsy od #${index + 1}`;
      detailsTable.appendChild(detailsText);
    };

    remove.onclick = function () {
      modal.style.display = "block";
      denidConfirmButton.onclick = () => {
        modal.style.display = "none";
      };
      removeConfirmButton.onclick = () => {
        modal.style.display = "none";
        state.data.results = state.data.results.filter(
          (item, resultIndex) => index !== resultIndex
        );
        itemsVisible = itemsVisible - item?.length;
        printTable(state.data.results, page, itemsVisible);
      };
    };
  });

  tHead.appendChild(row);
  tbl.appendChild(tHead);
  tbl.appendChild(tBody);
}

function clearPage() {
  const clear = document.querySelector("table");
  if (clear) {
    clear.remove();
  }
}

async function allData(item) {
  if (item.next) {
    const data = await fetch(item.next);
    const response = await data.json();
    allElements.push(...response.results);
    allData(response);
  }
}

// const createPagesButtons = (page, itemsVisible, next, prev) => {
//   nextButton.addEventListener("click", async function () {
//     if (!next) {
//       alert("wiecej nie mam");
//     } else {
//       page = page + 1;

//       const response = await newPage(next, page, itemsVisible);

//       itemsVisible = response.results.length * page;
//     }
//   });

//   prevButton.addEventListener("click", async function () {
//     if (!prev) {
//       alert("nie da sie ");
//     } else {
//       page--;

//       itemsVisible = response.results.length * page;

//       const response = await newPage(prev, page, itemsVisible);
//     }
//   });
// };

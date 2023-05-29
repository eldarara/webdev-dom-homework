import { renderComments } from "./rendering.js";

let comments = [];
export { comments };

const addCommentTitle = document.querySelector(".add-comment-tittle");
const loader = document.querySelector(".loader");
const addFormButton = document.querySelector(".add-form-button");
const inputName = document.querySelector(".add-form-name");
const inputText = document.querySelector(".add-form-text");
const form = document.querySelectorAll(".form");
const addForm = document.querySelectorAll(".add-form");
const container = document.querySelector(".container");

export function getComments() {
  const fetchPromise = fetch(
    "https://webdev-hw-api.vercel.app/api/v1/eldar/comments",
    {
      method: "GET",
    }
  );
  return fetchPromise.then((response) => {
    loader.hidden = true;
    const jsonPromise = response.json();
    jsonPromise.then((responseData) => {
      comments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: comment.date,
          text: comment.text,
          likes: comment.likes,
          isLiked: comment.isLiked,
        };
      });
      renderComments();
      console.log(comments);
    });
  });
}

// "https://webdev-hw-api.vercel.app/api/v1/eldar/comments",

addCommentTitle.classList.add("hidden");
getComments();

addFormButton.addEventListener("click", (event) => {
  form.forEach((element) => {
    if (element.value === "") {
      element.classList.add("error");
    } else {
      element.classList.remove("error");
    }
  });

  if (inputName.value === "" || inputText.value.length < 1) {
    return;
  } else {
    const dateNow = Date.now();
    addForm.forEach((formElement) => {
      formElement.classList.add("hidden");
    });
    addCommentTitle.classList.remove("hidden");
    fetch("https://webdev-hw-api.vercel.app/api/v1/eldar/comments", {
      method: "POST",
      body: JSON.stringify({
        text: inputText.value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replace("|", "<div class='quote'>")
          .replace("|", "</div>"),
        name: inputName.value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;"),
      }),
    })
      .then((response) => {
        console.log("Время", Date.now() - dateNow);
        return response;
      })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 400) {
          throw new Error("Слишком коротко");
        } else {
          throw new Error("Сервер упал, подержите пожалуйста");
        }
      })
      .then((response) => {
        console.log("Время", Date.now() - dateNow);
        return response;
      })
      .then(() => {
        return getComments();
      })
      .then((data) => {
        addFormButton.disabled = false;
        addFormButton.textContent = "Написать";
        addForm.forEach((formElement) => {
          formElement.classList.remove("hidden");
          addCommentTitle.classList.add("hidden");
        });
        inputName.value = "";
        inputText.value = "";
      })
      .catch((error) => {
        if (error.message === "Сервер упал, подержите пожалуйста") {
          alert("Сервер сломался, попробуйте позже");
        } else if (error.message === "Слишком коротко") {
          alert("Имя и текст комментария должны содержать 3 символа");
          addCommentTitle.classList.add("hidden");
        } else {
          alert("у вас пропал интернет попробуйте позже");
        }
        addForm.forEach((formElement) => {
          formElement.classList.remove("hidden");
        });
      });
  }

  // renderComments(); возможно будет работать и тут
  initLikeButtonListener();
});

inputName.addEventListener("input", (event) => {
  if (event.target.value !== "") {
    addFormButton.disabled = false;
  }
});

inputText.addEventListener("input", (event) => {
  if (event.target.value !== "") {
    addFormButton.disabled = false;
  }
});

export const initLikeButtonListener = () => {
  const commentFooter = document.querySelectorAll(".comment-footer");
  const commentTexts = document.querySelectorAll(".comment-text");
  commentTexts.forEach((commentText) => {
    commentText.addEventListener("click", (event) => {
      const index = commentText.dataset.index;
      const inputText = document.querySelector(".add-form-text");
      inputText.value = `< ${comments[index].name} ${comments[index].comment}`;
    });
  });
  commentFooter.forEach((element) => {
    const likesCounter = element.firstElementChild.firstElementChild;
    const likeButton = element.lastElementChild;
    likeButton.addEventListener("click", (event) => {
      const currentLikes = parseInt(likesCounter.textContent);
      const index = likeButton.dataset.index;

      if (comments[index].isLiked === true) {
        const oldLikes = currentLikes - 1;
        likesCounter.textContent = oldLikes;
        comments[index].isLiked = false;
        comments[index].likes = oldLikes;
      } else {
        const newLikes = currentLikes + 1;
        likesCounter.textContent = newLikes;
        comments[index].isLiked = true;
        comments[index].likes = newLikes;
      }

      renderComments();
    });
  });
};

export const editClick = () => {
  const editButtons = document.querySelectorAll(".edit-button");

  for (const editButton of editButtons) {
    editButton.addEventListener("click", (event) => {
      console.log("click", event.target);
      const index = editButton.dataset.index;
      // const commentText = commentsListArray[id].msg;
      const fragment = document.createDocumentFragment();
      const popup = document.createElement("div");
      popup.classList.add("popup");
      container.appendChild(popup);
      const popupTextarea = document.createElement("textarea");
      popupTextarea.classList.add("editText");
      //popupTextarea.textContent = comments[index].comment;
      //у тебя в массиве comments[index].text , а ты пишешь в textContent  comments[index].comment
      // в saveEditComment тоже самое

      popupTextarea.textContent = comments[index].text;
      const saveButton = document.createElement("button");
      saveButton.textContent = "cохранить комментарий";
      saveButton.classList.add("save_button");
      fragment.appendChild(popupTextarea);
      fragment.appendChild(saveButton);
      popup.appendChild(fragment);
      saveEditComment(index, popup);
    });
  }
};

export function saveEditComment(index, popup) {
  const saveButtonClick = document.querySelector(".save_button");
  saveButtonClick.addEventListener("click", (e) => {
    const editText = document.querySelector(".editText");
    if (editText.value.length > 10) {
      //comments[index].comment = editText.value;
      // тут было тоже самое
      comments[index].text = editText.value;
      popup.remove();
      renderComments();
    }
  });
}

export function dateFormat(date) {
  let DD, MM, YY, hh, mm;
  date.getDate() < 10 ? (DD = "0" + date.getDate()) : (DD = date.getDate());
  date.getMonth() < 10
    ? (MM = "0" + (date.getMonth() + 1))
    : (MM = date.getMonth() + 1);
  date.getFullYear()
    ? (YY = date.getFullYear().toString().slice(-2))
    : (YY = date.getFullYear().toString().slice(-2));
  date.getHours() < 10 ? (hh = "0" + date.getHours()) : (hh = date.getHours());
  date.getMinutes() < 10
    ? (mm = "0" + date.getMinutes())
    : (mm = date.getMinutes());
  return `${DD}.${MM}.${YY} ${hh}:${mm}`;
}

import { comments } from "./api.js";

const commentList = document.querySelector(".comments");


export const renderComments = () => {
  const commentsHtml = comments
    .map((comment, index) => {
      return `<li class='comment'>
    <div class='comment-header'>
      <div>${comment.name}</div>
      <div>${dateFormat(new Date(comment.date))}
        </div>
      </div>
      <div class='comment-body'>
        <div class= 'comment-text'
        data-index="${index}"
        > ${comment.text} </div>
        </div>
        <div class='comment-footer'>
        <div class='likes'>
        <span class= 'likes-counter'> ${comment.likes}
          </div>
        <button class='like-button ${
          comment.isLiked ? "-active-like" : ""
        }' data-index="${index}"></button>
        </div>
        <div class='edit-container'>
          <button class='edit-button ${
            comment.edit ? "" : "edit-click"
          }' data-index="${index}">Изменить комментарий</button>
        </div>

    </li>`;
    })
    .join("");

  commentList.innerHTML = commentsHtml;
  initLikeButtonListener();
  editClick();
};

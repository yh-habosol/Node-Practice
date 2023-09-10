
const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
let btnList = document.querySelectorAll(".deleteBtn");


const addComment = (text, newCommentId) => {
    const commentList = document.getElementById("commentList");
    const li = document.createElement("li");
    const span = document.createElement("span");
    const button = document.createElement("button");

    span.innerText = text;
    button.innerText = "X";
    button.classList.add("deleteBtn");

    li.appendChild(button);
    li.appendChild(span);
    li.dataset.id = newCommentId;
    
    commentList.prepend(li);

    btnList = document.querySelectorAll(".deleteBtn");
    btnList.forEach((btn) => {
        btn.addEventListener("click", handleBtn);
    });
}


const handleSubmit = async (event) => {
    event.preventDefault();
    const {id} = videoContainer.dataset;
    const textarea = commentForm.querySelector("textarea")
    const text = textarea.value;


    if(text === "")
        return;

    const response = await fetch(`/api/videos/${id}/comment`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
    });

    if(response.status === 201){
        textarea.value = "";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }

}

const handleBtn = async (event) => {
    const videoId = videoContainer.dataset.id;
    const commentId = event.target.parentNode.dataset.id;
    const li = event.target.parentNode;
    li.remove();
    await fetch(`/api/videos/${videoId}/comment/${commentId}/delete`, {
        method: "POST"
    });

}

if(commentForm){
    commentForm.addEventListener("submit", handleSubmit);
}
if(btnList){
    btnList.forEach((btn) => {
        btn.addEventListener("click", handleBtn);
    });
}

